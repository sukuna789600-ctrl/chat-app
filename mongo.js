const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://sukuna789600:Elvoria%40123@elvoria.sziv14f.mongodb.net/?appName=Elvoria")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
