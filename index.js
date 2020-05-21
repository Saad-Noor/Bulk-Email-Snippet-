

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

  console.log("data <::: ", emailList);
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

  let info = await transporter.sendMail({
    from: '"XYZ Co. 👻" <abc@xyz.com>', // sender email
    to: toEmailList, // list of receivers email
    subject: "Hello ✔", // Subject line
    html: "<b>Muhammad Saad</b><p>"+emailMsg+"</p>", // html body
  });

  // toEmailList.forEach(email => {
  //   setInterval(()=>{
  //     transporter.sendMail({
  //       from: '"XYZ Co. 👻" <abc@xyz.com>', // sender email
  //       to: email, // list of receivers email
  //       subject: "Hello ✔", // Subject line
  //       html: "<b>Muhammad Saad</b><p>"+emailMsg+"</p>", // html body
  //     },()=>{
  //       console.log("send to ",email);
  //       console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));    
  //     });
  //   },500)
  // });

  // Preview only available when sending through an Ethereal account
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

