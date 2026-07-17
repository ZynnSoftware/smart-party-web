import { Link } from 'react-router-dom'
import { LegalLayout, LegalSection } from './LegalLayout'

export function TermsPage() {
  return (
    <LegalLayout
      title="Termos de Uso"
      description="Termos de Uso do reparteaí — regras para criar e organizar eventos, cadastrar convidados e usar o planejador de festas."
      path="/termos"
      updatedAt="17 de julho de 2026"
    >
      <LegalSection title="1. Sobre o reparteaí">
        <p>
          O reparteaí é uma ferramenta que ajuda anfitriões de festas a planejar eventos: gerar
          lista de compras estimada, controlar orçamento e dividir custos entre convidados. Ao usar
          o reparteaí, você concorda com estes Termos de Uso.
        </p>
      </LegalSection>

      <LegalSection title="2. Quem pode usar">
        <p>
          O reparteaí é destinado a maiores de 18 anos. Ao criar uma conta, você declara que tem
          capacidade legal para aceitar estes termos.
        </p>
      </LegalSection>

      <LegalSection title="3. Sua conta">
        <ul className="list-disc pl-5">
          <li>Você é responsável por manter a confidencialidade das suas credenciais de acesso.</li>
          <li>
            Você é responsável pela veracidade das informações que cadastra (dados do evento,
            chave Pix, convidados).
          </li>
          <li>
            Podemos suspender ou encerrar contas que violem estes termos ou usem a plataforma de
            forma abusiva.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. O que você pode fazer">
        <ul className="list-disc pl-5">
          <li>Criar e editar eventos, listas de compras e divisões de custo.</li>
          <li>
            Compartilhar informações do evento (incluindo cobrança e chave Pix) com seus
            convidados, por fora da plataforma (WhatsApp, etc).
          </li>
          <li>Convidar colaboradores para editar um evento com você.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. O que você não pode fazer">
        <ul className="list-disc pl-5">
          <li>Usar o reparteaí para fins ilegais, fraudulentos ou para lesar terceiros.</li>
          <li>
            Cadastrar dados de terceiros (convidados) sem ter uma relação legítima com eles no
            contexto do evento que está organizando.
          </li>
          <li>
            Tentar acessar dados de outros usuários, burlar limites de uso ou a autenticação da
            plataforma.
          </li>
          <li>Fazer engenharia reversa, copiar ou redistribuir o software sem autorização.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Dados de convidados cadastrados por você">
        <p>
          Ao cadastrar nomes, valores ou informações de convidados para organizar a divisão de
          custos, você (anfitrião) atua como responsável por garantir que esse uso é adequado ao
          contexto do evento — ver nossa{' '}
          <Link to="/privacidade" className="font-bold text-primary hover:underline">
            Política de Privacidade
          </Link>{' '}
          para mais detalhes sobre como tratamos esses dados.
        </p>
      </LegalSection>

      <LegalSection title="7. Cobrança e chave Pix">
        <p>
          O reparteaí <strong>não processa pagamentos entre você e seus convidados</strong> —
          apenas organiza a informação (valores, chave Pix) para que a cobrança seja feita por fora
          (ex.: WhatsApp). Não temos qualquer responsabilidade sobre transações Pix realizadas
          entre anfitrião e convidados.
        </p>
      </LegalSection>

      <LegalSection title="8. Assinatura e limites de uso gratuito">
        <p>
          O uso gratuito do reparteaí tem limites (número de eventos criados e edições).
          Funcionalidades adicionais podem exigir assinatura paga, cujas condições (valor, forma
          de cobrança, cancelamento) serão apresentadas no momento da contratação.
        </p>
      </LegalSection>

      <LegalSection title="9. Disponibilidade do serviço">
        <p>
          Fazemos o possível para manter o reparteaí disponível, mas não garantimos operação
          ininterrupta ou livre de erros. Podemos alterar, suspender ou descontinuar
          funcionalidades a qualquer momento, com aviso razoável quando possível.
        </p>
      </LegalSection>

      <LegalSection title="10. Limitação de responsabilidade">
        <p>
          O reparteaí é fornecido "como está". Não nos responsabilizamos por decisões financeiras
          tomadas com base nas estimativas geradas pela plataforma, nem por problemas decorrentes
          de cobranças feitas por fora da plataforma (Pix, WhatsApp).
        </p>
      </LegalSection>

      <LegalSection title="11. Alterações nestes termos">
        <p>
          Podemos atualizar estes Termos de Uso periodicamente. Mudanças relevantes serão
          comunicadas na plataforma. O uso continuado após a atualização implica aceite dos novos
          termos.
        </p>
      </LegalSection>

      <LegalSection title="12. Contato">
        <p>
          Dúvidas sobre estes termos podem ser enviadas para{' '}
          <a href="mailto:contato@zynn.com.br" className="font-bold text-primary hover:underline">
            contato@zynn.com.br
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
