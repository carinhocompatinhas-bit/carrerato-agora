# Sugestões por vaga e ajuste de foto

## Objetivo
Adicionar uma análise simples da vaga com Lovable AI e permitir que a pessoa recorte e reposicione sua foto no próprio celular antes de usá-la no currículo.

## O que será construído
- Nova etapa “Ajustar para uma vaga” com campo para colar a descrição e botão para gerar sugestões.
- Envio apenas do texto profissional necessário (vaga, objetivo, qualidades, experiências, estudos e cursos), sem foto nem contatos pessoais.
- Resultado organizado em objetivo sugerido, qualidades relevantes e melhorias práticas, com controles para aplicar cada sugestão ao currículo.
- Estados claros de carregamento, sucesso e erro, mantendo a descrição digitada no aparelho.
- Editor de foto em janela simples, com arrastar para reposicionar e controle de zoom.
- Recorte quadrado final em JPEG reduzido, salvo somente no aparelho e refletido na prévia.

## Detalhes técnicos
- A análise será executada no servidor pelo AI Gateway com o modelo padrão `openai/gpt-6-astra`; a chave e as instruções não irão para o navegador.
- A resposta terá estrutura validada antes de chegar à tela, com mensagens específicas para erros de configuração, créditos, limite e indisponibilidade.
- O editor usará Canvas no navegador, sem enviar a imagem para a nuvem.
- Serão atualizados os registros internos de arquitetura e tarefas para documentar a privacidade da foto e a fronteira da IA.

## Verificação
- Testar uma análise real de descrição de vaga e a aplicação das sugestões.
- Testar seleção, zoom, reposicionamento, confirmação e remoção da foto em tela de celular.
- Conferir prévia, salvamento automático e ausência de erros no aplicativo.
