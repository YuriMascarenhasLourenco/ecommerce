import axios from 'axios';

(
   async()=>{
   const {data:{token}}= await axios.post('http://localhost:3000/auth/register',{
    username:'username',
    password: 'password'
   })

   const {data}= await axios.get('http://localhost:3000/auth',{
      headers:{
         Authorization:'Bearer + ${token}'
      }
   })
})