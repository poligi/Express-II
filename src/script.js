
/// ------ CONFIGS INICIAIS  DO EXPRESS ---------
import express from 'express'
import cors  from 'cors'
import bcrypt from 'bcrypt'

const app = express()

app.use(cors())

app.use(express.json())


//------------------------

let carros = []   //Criamos um array que armazenará os veículos
let pessoas = [] //Criamos um array que armazene as pessoas usuarias
let proximoId = 1  // Criamos uma variável que vai automatizar a criação dos ids
let proximoUserId = 1

/* 

  Dados do carro : modelo, marca, ano, cor e preço.


*/


//-------------------- ATUALIZAR carro -------------------------

app.put('/carros/:idBuscado', (request, response) => {
    //Criamos as variáveis que vamos pegá-las via parametros do corpo da requestuisição
    const modeloDocarro = request.body.modeloDocarro
    const marcaCarro = request.body.marcaCarro
    const anoDoCarro = Number(request.body.anoDoCarro)
    const precoDoCarro = request.body.precoDoCarro
    const corDoCarro = request.body.corDoCarro
    
    // No endereço da nossa aplicação, passamos como  parametro o  :idBuscado. Portanto, devemoscriar um path parameter para poder atualizar o carro, baseado no id que estamos buscando 
    const idBuscado = Number(request.params.idBuscado)

    // Como para deletar um produto, 
    if (!idBuscado) {
      response.status(400).send(JSON.stringify({
        Mensagem: 'Verifique se passou corretamente na busca o Id da carro buscado',
      }))
      return
    }
  
    const idVerificado = carros.findIndex(carro => carro.id === idBuscado)
  
    if (idVerificado === -1) {
      response.status(400).send(JSON.stringify({
        Mensagem: 'Id da carro não encontrado no nosso banco de dados',
      }))
      return
    }

    if (!modeloDocarro) {
      response.status(400).send(JSON.stringify({
        Mensagem: 'Verifique se passou corretamente o novo nome que deve ser atualizado ',
      }))
      return
    }

    if (!marcaCarro) {
      response.status(400).send(JSON.stringify({
        Mensagem: 'Verifique se passou corretamente a nova marca que deve ser atualizada ',
      }))
      return
    }
    
    if (!anoDoCarro) {
      response.status(400).send(JSON.stringify({
        Mensagem: 'Verifique se passou corretamente a nova marca que deve ser atualizada ',
      }))
      return
    }
  
    if (!corDoCarro) {
      response.status(400).send(JSON.stringify({
        Mensagem: 'Verifique se passou corretamente o novo preço que deve ser atualizado ',
      }))
      return
    }

    if (!precoDoCarro) {
      response.status(400).send(JSON.stringify({
        Mensagem: 'Verifique se passou corretamente a nova marca que deve ser atualizada ',
      }))
      return
    }
    
    if (idVerificado !== -1) {
      const carro = carros[idVerificado]
      carro.modeloDocarro = modeloDocarro
      carro.marcaCarro = marcaCarro
      carro.anoDoCarro = anoDoCarro
      carro.precoDoCarro = precoDoCarro
      carro.corDoCarro = corDoCarro

      response.status(200).send(JSON.stringify({
        Mensagem: ` Carro ${carro.modeloDocarro} atualizada com sucesso!`,
        Dados: carro,
      }))
    }
  })
  

//-------------------- DELETAR carro -------------------------

app.delete('/carros/:idBuscado', (request, response) => {
  //Como vamos buscar um carro especifico, utilizamos um id que irá identificar qual carro é  
  const idBuscado = Number(request.params.idBuscado)

  if (!idBuscado) {
    response.status(400).send(JSON.stringify({
      Mensagem: 'Verifique se passou corretamente na busca o Id da carro buscada'
    }))
    return
  }

  const idVerificado = carros.findIndex(carro => carro.id === idBuscado)

  if (idVerificado === -1) {
    response.status(400).send(JSON.stringify({
      Mensagem: 'Indetificador (Id) do carro não encontrado no nosso banco de dados'
    }))
    return
  }else{
    carros.splice(idVerificado, 1)

    response.status(200).send(JSON.stringify({
      Mensagem: `Carro deletado com sucesso!`
    }))
  }

})

//-------------------- SIGNUP DE CRIAR USUÁRIO ---------------- 

app.post('/signup',async(request,response)=>{
  //Pegamos as variáveis para criação via corpo da requisicao
  const {nome, email , senha} = request.body

  //Verificamos se a pessoa passou o nome
  if(!nome){
    response.status(400).json({
          message: 'Verifique se você passou o nome de usuário válido'
      })
  }

  //Verificamos se a pessoa passou o email
  if(!email){
    response.status(400).json({
          message: 'Verifique se você passou o email de usuário válido'
      })
  }

  //Verificamos se a pessoa passou o senha
  if(!senha){
    response.status(400).json({
          message: 'Verifique se você passou a senha de usuário válida'
      })
  }

  const senhaHasheada = await bcrypt.hash(senhaPessoaUsuaria, 10)

  // Criamos uma nova pessoa usuária,que recebe como id o proximo User Id
  const novaPessoaUsuaria = {
      id: proximoUserId, 
      nome: nome,
      email: email,
      senha: senhaHasheada
  }

  //Inserimos a nova pessoa usuária no array de pessoas
  pessoas.push(novaPessoaUsuaria)

  //Adicionamos 1 ao identificador
  proximoUserId ++

  //Fornecemos a resposta
  response.status(201).json({
      sucess: true,
      message: ' Pessoa usuária cadastrada com sucesso'
  })
  
}) 

//------------------- LOGIN -----------------------------------

app.put('/login', async (request,response)=>{
      //Pegamos o email e senha das pessoas usuárias via corpo da requisicao
      const emailPessoaUsuaria = request.body.emailPessoaUsuaria
      const senhaPessoaUsuaria = request.body.senhaPessoaUsuaria

      //Verificamos se a pessoa passou a senha da pessoa usuária, se não retorna mensagem
      if (!senhaPessoaUsuaria) {
          return response.status(400).json({ message: 'Senha inválida.' })
      }

      //Verificamos se a pessoa passou o email da pessoa usuária, se não retorna mensagem
      if (!emailPessoaUsuaria) {
          return response.status(400).json({ message: 'Passe um email válido.' })
      }

      //Buscamos se a pessoa usuária possui a senha no banco de daods
      const pessoaBuscada = pessoas.find( pessoa => pessoa.emailPessoaUsuaria === emailPessoaUsuaria)

      //Verificamos essa pessoa no nosso banco de dados
      if (!pessoaBuscada) {
          return response.status(404).json({message: "Pessoa usuária não encontrada no nosso banco. Verifique o e-mail passado."})
      }

      //Comparamos a senha usando o bcrypt
      const senhaEncontrada = await bcrypt.compare(senhaPessoaUsuaria, pessoaBuscada.senhaPessoaUsuaria)

      //Se a senha não for compativel no banco de dados, retorna mensagem
      if(!senhaEncontrada){
          return response.status(400).json({message: "Credenciais inválidas."})
      }

      //Se for compativel retorna os dados
      response.status(200).json({
          message: "Login bem-sucedido!",
          userId: pessoaBuscada.id
      })

})


//-------------------- VERIFICAR API  -------------------------


app.listen(8080, () => console.log("Servidor iniciado na porta 8080"))