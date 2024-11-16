import express from 'express'
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/usuarios',async (req, res) => {

  const usuarios = await prisma.usuarios.findMany();

  res.status(200).json(usuarios)
})

app.get('/usuarios/:name',async (req, res) => {

  const usuarios = await prisma.usuarios.findUnique({
    where:{
      name : req.params.name
    }
  });

  res.status(200).json(usuarios)
})

app.post('/usuarios',async (req,res) => {

  const emailExists = await prisma.usuarios.findFirst({
    where : {
      email: req.body.email
    }
  })

  if(!emailExists){
    res.status(400).json({
      message : "Email já existe"
     })
     return
  }

  await prisma.usuarios.create({
    data:{
      name: req.body.name,
      age : req.body.age,
      email : req.body.email
    }
  });

  res.status(201).json({
    message: "Usuário criado com sucesso",
    usuario: req.body
  })
})

app.put('/usuarios/:id', async (req,res) =>{
  
  const userExists = await prisma.usuarios.findFirst({
    where : {
      id : req.params.id
    }
  })

  if(userExists == null){
    res.status(404).json({
      message : "Usuário não existe"
     })
     return
  }

  const emailExists = await prisma.usuarios.findFirst({
    where : {
      email: req.body.email
    }
  })

  if(emailExists){
    res.status(400).json({
      message : "Email já existe"
     })
     return
  }


  await prisma.usuarios.update(
    { 
      where:{
        id : req.params.id
      },
      data:{
        name: req.body.name,
        age : req.body.age,
        email : req.body.email
      }
    }
  );

  res.status(200).json({
    message : "Usuário atualizado com sucesso!"
  })
})

app.delete('/usuarios/:id', async (req,res)=>{

  await prisma.usuarios.delete({
    where :{
      id : req.params.id
    }
  })

  res.status(200).json({
    message : "Usuário deletado com sucesso!"
  })

})

app.listen(3000, ()=>{
  console.log("Servidor está rodando na porta 3000")
})