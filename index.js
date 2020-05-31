

const nodemailer = require("nodemailer");
const fs = require("fs");
// async..await is not allowed in global scope, must use a wrapper
async function main() {
  var emailList
  const batchSize=1000
  let path = "./email_list.csv"
  fs.readFile(path,'utf8',async (err,data)=>{
    if (err) throw err;
    //data=data.replace(/\r?\n|\r/g,",")
    data = data.split(/\r?\n|\r/g)
    emailList = data
    let attempt = parseInt(data.length/batchSize)
    console.log("attempt" , attempt);
    
    if(attempt>0){
      for(var i=0;i<(attempt);i++){
        const list = emailList.slice(i*batchSize,(i+1)*batchSize)
        sendEmail(list,"This is my testing")
      }
      sendEmail(emailList.slice((attempt)*batchSize),"This is mz testing")
    }else{
      sendEmail(emailList,"This is my testing")
    }
    
  });

}

main().catch(console.error);

async function sendEmail(toEmailList, emailMsg){
  let testAccount = await nodemailer.createTestAccount();
  // create transporter object using the default SMTP transport
  console.log("list size ",toEmailList.length);
  
  let transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // username
      pass: testAccount.pass, // password
    },
  });
  
var it = 0
let interval = setInterval(async()=>{
  if(it<toEmailList.length){
    info = await transporter.sendMail({
      from: '"XYZ Co" <abc@xyz.com>', // sender email
      to: toEmailList[it], // list of receivers email
      subject: "Hello ✔", // Subject line
      html: "<b>Muhammad Saad</b><p>"+emailMsg+"</p>", // html body
    });
    console.log("it: " ,it, " send to ",toEmailList[it] , " Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }else{
    clearInterval(interval)
  }
  it++
},500)

}

