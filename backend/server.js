const app = require("./app");
const connectToDb = require("./db");

connectToDb()
.then(()=>{
    console.log("Connected to mongodb");
    app.listen(3001, ()=>{
        console.log("Server is running on port 3001");
    })
})
.catch(err => {console.log(err);})


