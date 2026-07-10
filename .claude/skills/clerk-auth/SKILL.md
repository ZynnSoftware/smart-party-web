---
name: clerk-auth
description: How our platforms handle authentication (Clerk) and authorization (our own RBAC). Use when implementing sign-in/sign-up, protecting routes or endpoints, writing auth guards or middleware, checking roles/permissions, provisioning users, or linking a Clerk identity to a platform user.
---

# Authentication & Permissions (Clerk + our own RBAC)

> **How to read this skill.** What is binding is the **principles** — the Mental model, the Hard rules, and the lazy-provisioning flow. The code blocks are a **reference implementation, not a contract.** Role names, the shape of the RBAC model (flat roles, role + permissions, scopes per resource, etc.), entity fields, and folder layout are illustrative — adapt them to each application. A project does not need to copy this code; it needs to satisfy the directives. When in doubt, follow the principle, not the snippet.

## Mental model

- **Clerk authenticates. It never authorizes.** Clerk answers "who is this person and are they signed in". It does NOT decide what they can do.
- **Authorization lives in our database.** Roles and permissions are our domain. They are stored, queried, and enforced by us.
- **Email is the only link** between a Clerk identity and a platform user. It is a natural domain identifier, so it keeps us decoupled from the auth vendor.

## Hard rules (do not break these)

1. The database NEVER references a third-party tool. No `clerkId`, no `clerkUserId`, no `externalId` columns. If we swapped Clerk for another provider tomorrow, no migration should be needed.
2. Authorization is enforced **server-side, always**. Client-side role checks are for UX only (hiding buttons), never for security.
3. Never trust roles coming from the token or from Clerk metadata. Load the platform user from our DB and read roles from there.
4. The Clerk user object never leaks past the auth layer. Controllers, services, and domain code only ever see our `User` entity.

## User provisioning (lazy / just-in-time)

Administrators create users **in Clerk**. We do not pre-create them in our database.

On the **first authenticated request**, the application looks up the platform user by email and creates the record if it does not exist yet. This is the only place a user row is born.

```
Admin invites user in Clerk
        │
        ▼
User signs in (Clerk handles credentials, MFA, etc.)
        │
        ▼
First request hits our API with a valid Clerk session token
        │
        ▼
Guard resolves email → findOrCreateByEmail → platform user exists from now on
```

No webhooks are required for this flow. Provisioning happens on demand, driven by the email in the verified session.

## Environment & packages

Backend (`-api`):
```
CLERK_SECRET_KEY=sk_...
```
```bash
npm install @clerk/backend
```

Frontend (`-web`):
```
VITE_CLERK_PUBLISHABLE_KEY=pk_...
```
```bash
npm install @clerk/clerk-react
```

> Make sure the Clerk **JWT/session token includes the `email` claim** (configure a JWT template, or read it from the user on provisioning). Email is what binds the two systems.

---

## Backend (NestJS)

### User entity — no vendor coupling

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  // The link to the Clerk identity is the email, nothing else.
  @Column({ unique: true })
  email: string

  @Column('simple-json')
  roles: Role[]

  // No clerkId / external-tool columns. Ever.
}
```

The role model below is **only an example**. Each application defines its own roles — and may use a richer model entirely (role + granular permissions, per-resource scopes, an editable roles table instead of an enum). The directive is just: *whatever the model is, it lives in our database and is enforced by us.*

```typescript
// Example only — replace with the roles/permission model this app actually needs.
export enum Role {
  Admin = 'admin',
  Manager = 'manager',
  Member = 'member',
}

const DEFAULT_ROLES: Role[] = [Role.Member]
```

### Token verification — isolate the vendor behind a contract

The application depends on a vendor-neutral `TokenVerifier`. Only its Clerk adapter imports the SDK, so the vendor name never spreads beyond this one file.

```typescript
// auth/token-verifier.ts — vendor-neutral contract
export abstract class TokenVerifier {
  abstract verify(token: string): Promise<{ email: string }>
}
```

```typescript
// auth/clerk-token-verifier.ts — the ONLY backend file that imports @clerk/backend
import { verifyToken } from '@clerk/backend'

@Injectable()
export class ClerkTokenVerifier extends TokenVerifier {
  async verify(token: string): Promise<{ email: string }> {
    const claims = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    })
    if (!claims.email) throw new UnauthorizedException()
    return { email: claims.email }
  }
}
```

Bind the adapter once, in the auth module. Swapping providers later means changing only this line and the adapter:

```typescript
@Module({
  providers: [{ provide: TokenVerifier, useClass: ClerkTokenVerifier }],
  exports: [TokenVerifier],
})
export class AuthModule {}
```

### Auth guard — vendor-neutral (verify token + just-in-time provisioning)

```typescript
// auth/auth.guard.ts — knows nothing about Clerk
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokens: TokenVerifier,
    private readonly users: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractBearerToken(request)
    if (!token) throw new UnauthorizedException()

    const { email } = await this.tokens.verify(token)

    // Lazy provisioning: first access creates the platform user.
    const user = await this.users.findOrCreateByEmail(email)

    request.user = user // our domain user
    return true
  }

  private extractBearerToken(request: Request): string | null {
    const header = request.headers.authorization
    if (!header?.startsWith('Bearer ')) return null
    return header.slice('Bearer '.length)
  }
}
```

### Just-in-time provisioning lives in the service

```typescript
async findOrCreateByEmail(email: string): Promise<User> {
  const existing = await this.repo.findOne({ where: { email } })
  if (existing) return existing

  // First access for a Clerk-provisioned account → create our record.
  const user = this.repo.create({ email, roles: DEFAULT_ROLES })
  return this.repo.save(user)
}
```

### Role decorator + roles guard (authorization from our DB)

```typescript
export const ROLES_KEY = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!required?.length) return true

    const { user } = context.switchToHttp().getRequest()
    return required.some((role) => user.roles.includes(role))
  }
}
```

Usage — `AuthGuard` runs first (resolves the user), `RolesGuard` reads roles from our DB:

```typescript
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Delete(':id')
remove(@Param('id') id: string) {
  return this.suppliers.remove(id)
}
```

---

## Frontend (React)

Roles live in OUR database, so the frontend learns permissions from OUR API (e.g. `GET /me`), not from Clerk. Clerk only tells the app whether someone is signed in.

### Provider

```tsx
// main.tsx
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={publishableKey}>
    <App />
  </ClerkProvider>,
)
```

### Route protection (authentication only)

```tsx
// auth/RequireAuth.tsx
export function RequireAuth({ children }: PropsWithChildren) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return <FullScreenLoader />
  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  return <>{children}</>
}
```

### Permission gating (authorization from our user)

```tsx
// auth/Can.tsx — reads the platform user fetched from our /me endpoint
export function Can({ role, children }: { role: Role } & PropsWithChildren) {
  const { user } = useCurrentUser()

  if (!user?.roles.includes(role)) return null
  return <>{children}</>
}
```

```tsx
<Can role={Role.Admin}>
  <DeleteButton />
</Can>
```

> Hiding a button is UX, not security. The matching endpoint must still be guarded on the backend.

### Attaching the token (services only handle API communication)

The services layer must stay vendor-neutral — it knows nothing about Clerk. It asks an injected **token provider** for a token; a single auth file wires that provider to Clerk.

```typescript
// services/api.ts — no Clerk here
type TokenProvider = () => Promise<string | null>

let getToken: TokenProvider = async () => null

export function setTokenProvider(provider: TokenProvider) {
  getToken = provider
}

api.interceptors.request.use(async (config) => {
  const token = await getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

```tsx
// auth/AuthTokenBridge.tsx — the ONLY frontend file that knows Clerk owns the token.
// Mount it once inside <ClerkProvider>.
export function AuthTokenBridge() {
  const { getToken } = useAuth()

  useEffect(() => {
    setTokenProvider(() => getToken())
  }, [getToken])

  return null
}
```

> Use Clerk's official `useAuth().getToken()` — never the `window.Clerk` global. If Clerk is ever replaced, only `AuthTokenBridge` changes; `services/` does not.

---

## Anti-patterns

- ❌ Adding a `clerkId` / `externalId` column to any entity.
- ❌ Authorizing based on Clerk roles, `publicMetadata`, or anything stored in Clerk.
- ❌ Trusting client-side `Can`/role checks as a security boundary.
- ❌ Passing the Clerk user object into services or domain logic.
- ❌ Calling Clerk (hooks or the `window.Clerk` global) from the `services/` layer — inject a token provider instead.
- ❌ Pre-seeding users via webhooks when lazy provisioning already covers it.
- ❌ Reading roles from the JWT claims instead of from our database.

## Quick checklist

- [ ] Entity links to Clerk by `email` only — no vendor columns
- [ ] `AuthGuard` verifies the token (via `TokenVerifier`) and does find-or-create by email
- [ ] Only the `ClerkTokenVerifier` adapter imports `@clerk/backend` — the vendor name lives nowhere else
- [ ] Roles/permissions read from our DB (not from the token or Clerk), by whatever model the app uses
- [ ] Every protected endpoint is guarded server-side
- [ ] Frontend gates UI from `/me`, not from Clerk
- [ ] `CLERK_SECRET_KEY` and `VITE_CLERK_PUBLISHABLE_KEY` set, never committed
