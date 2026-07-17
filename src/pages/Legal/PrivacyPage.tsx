import { LegalLayout, LegalSection } from './LegalLayout'

export function PrivacyPage() {
  return (
    <LegalLayout
      title="Política de Privacidade"
      description="Política de Privacidade do reparteaí — quais dados coletamos, para que servem, com quem compartilhamos e seus direitos sob a LGPD."
      path="/privacidade"
      updatedAt="17 de julho de 2026"
    >
      <p className="text-sm leading-relaxed">
        Esta política explica quais dados pessoais o reparteaí coleta, para que servem, com quem
        são compartilhados e quais direitos você tem, em conformidade com a Lei Geral de Proteção
        de Dados (LGPD — Lei 13.709/2018).
      </p>

      <LegalSection title="1. Quem somos">
        <p>
          O reparteaí é o controlador dos dados pessoais tratados nesta plataforma, nos termos do
          art. 5º, VI da LGPD.
        </p>
      </LegalSection>

      <LegalSection title="2. Quais dados coletamos">
        <p className="font-bold text-on-surface">2.1 Dados da sua conta</p>
        <ul className="list-disc pl-5">
          <li>
            <strong>E-mail</strong> — usado para login (via Clerk) e identificação da sua conta.
          </li>
          <li>
            <strong>Identificador de assinatura</strong> (quando aplicável) — vinculado ao
            processador de pagamento, para controle de plano.
          </li>
        </ul>

        <p className="font-bold text-on-surface">2.2 Dados que você cadastra ao organizar um evento</p>
        <ul className="list-disc pl-5">
          <li>
            <strong>Chave Pix</strong> — para incluir na mensagem de cobrança que você envia aos
            convidados. Armazenada para reuso entre eventos.
          </li>
          <li>
            <strong>Nomes de convidados/pagadores e valores devidos</strong> — para montar a
            divisão de custos e o controle de pagamentos.
          </li>
          <li>
            <strong>Notas livres sobre o evento</strong> — texto que você escreve para descrever o
            evento (ex.: itens específicos que quer comprar), usado para gerar sugestões de lista
            de compras.
          </li>
          <li>
            <strong>E-mail de colaboradores</strong> — quando você convida outra pessoa para editar
            o evento com você.
          </li>
        </ul>

        <p className="font-bold text-on-surface">2.3 Dados de convidados</p>
        <p>
          Como anfitrião, você é quem cadastra nomes e valores de convidados na plataforma para
          organizar a divisão de custos do evento — nós não temos contato direto com essas
          pessoas. Você é responsável por garantir que esse cadastro é adequado ao contexto
          (organização de um evento do qual elas participam) e por informar os convidados sobre
          esse uso, se julgar necessário.
        </p>
      </LegalSection>

      <LegalSection title="3. Para que usamos esses dados">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant/30 text-on-surface">
                <th className="py-2 pr-4 font-extrabold">Dado</th>
                <th className="py-2 font-extrabold">Finalidade</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-outline-variant/20">
                <td className="py-2 pr-4">E-mail</td>
                <td className="py-2">Autenticação, identificação de dono do evento, comunicação sobre a conta</td>
              </tr>
              <tr className="border-b border-outline-variant/20">
                <td className="py-2 pr-4">Chave Pix</td>
                <td className="py-2">Montar a mensagem de cobrança que você compartilha com convidados</td>
              </tr>
              <tr className="border-b border-outline-variant/20">
                <td className="py-2 pr-4">Nomes e valores de convidados</td>
                <td className="py-2">Calcular e exibir a divisão de custos do evento</td>
              </tr>
              <tr className="border-b border-outline-variant/20">
                <td className="py-2 pr-4">Notas do evento</td>
                <td className="py-2">Gerar sugestões de itens de compra por inteligência artificial</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Identificador de assinatura</td>
                <td className="py-2">Controlar acesso a funcionalidades pagas</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Não usamos seus dados para fins diferentes dos descritos acima sem te avisar antes.</p>
      </LegalSection>

      <LegalSection title="4. Com quem compartilhamos dados">
        <p>
          Usamos os seguintes prestadores de serviço (operadores, nos termos da LGPD) para operar a
          plataforma:
        </p>
        <ul className="list-disc pl-5">
          <li><strong>Clerk</strong> — autenticação (processa seu e-mail).</li>
          <li><strong>Supabase</strong> — hospedagem do banco de dados (armazena todos os dados descritos acima).</li>
          <li><strong>Heroku</strong> — hospedagem da aplicação (servidor).</li>
          <li>
            <strong>Google (Gemini API)</strong> — recebe as notas livres que você escreve sobre o
            evento, para gerar sugestões de itens de compra por IA. Não enviamos e-mail nem chave
            Pix para esse serviço.
          </li>
          <li>
            <strong>Stripe</strong> (quando a assinatura estiver ativa) — processa pagamento da
            assinatura; recebe seu e-mail e um identificador interno de usuário.
          </li>
        </ul>
        <p>
          Não vendemos seus dados a terceiros. Só compartilhamos com os operadores acima, na medida
          necessária para o funcionamento do serviço.
        </p>
        <p>
          <strong>Importante:</strong> o reparteaí não envia a cobrança nem a chave Pix diretamente
          aos seus convidados — isso é feito por você, copiando a mensagem gerada e enviando por
          fora da plataforma (ex.: WhatsApp).
        </p>
      </LegalSection>

      <LegalSection title="5. Por quanto tempo guardamos seus dados">
        <p>
          Mantemos seus dados enquanto sua conta estiver ativa. Hoje você pode apagar eventos
          individualmente a qualquer momento. Um mecanismo para apagar a conta inteira (e todos os
          dados vinculados) está em desenvolvimento — enquanto isso, você pode solicitar a exclusão
          manualmente pelo contato abaixo.
        </p>
      </LegalSection>

      <LegalSection title="6. Seus direitos como titular de dados">
        <p>Nos termos do art. 18 da LGPD, você pode solicitar, a qualquer momento:</p>
        <ul className="list-disc pl-5">
          <li><strong>Confirmação e acesso</strong> aos dados que temos sobre você.</li>
          <li><strong>Correção</strong> de dados incompletos, inexatos ou desatualizados.</li>
          <li><strong>Eliminação</strong> dos dados tratados com seu consentimento.</li>
          <li><strong>Portabilidade</strong> dos seus dados a outro fornecedor de serviço.</li>
          <li><strong>Informação</strong> sobre com quem compartilhamos seus dados.</li>
        </ul>
        <p>
          Para exercer esses direitos, entre em contato pelo canal abaixo. Estamos trabalhando para
          disponibilizar exportação e exclusão de conta diretamente pela plataforma.
        </p>
      </LegalSection>

      <LegalSection title="7. Segurança">
        <p>
          Adotamos medidas técnicas razoáveis para proteger seus dados (autenticação obrigatória
          para criar/editar eventos, acesso restrito por dono/colaborador). Nenhum sistema é 100%
          livre de risco; se identificarmos um incidente de segurança que afete seus dados, você
          será notificado conforme exigido pela LGPD.
        </p>
      </LegalSection>

      <LegalSection title="8. Alterações nesta política">
        <p>
          Podemos atualizar esta política periodicamente. Mudanças relevantes serão comunicadas na
          plataforma, com a data de atualização revisada no topo deste documento.
        </p>
      </LegalSection>

      <LegalSection title="9. Contato">
        <p>
          Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato:{' '}
          <a href="mailto:contato@zynn.com.br" className="font-bold text-primary hover:underline">
            contato@zynn.com.br
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
