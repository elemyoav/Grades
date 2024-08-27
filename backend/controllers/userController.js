const { StatusCodes } = require("http-status-codes");

const User = require('../schemas/User');


const GetUserNames = async (req, res) => {
    try{
        const users = await User.find({});
        const user_names = users.map(u=>u.name);
        res.status(StatusCodes.OK).json(user_names);
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("oops something went wrong");
    }
}

const AddUser = async (req, res) => {
    try{
        const {username} = req.body;
        const user = new User(
            {
                name: username,
                grades: []
            }
        )

        await user.save()

        res.status(StatusCodes.CREATED).json(user);
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("somethign went wrong");
    }
}

const GetUser = async(req, res) => {
    try{
        const {username} = req.query;
        const user = await User.findOne({name:username}).populate('grades');
        if(user !== null){
            res.status(StatusCodes.OK).json(user);
        }
        else{
            res.status(StatusCodes.NOT_FOUND).send("No such user")
        }
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("error");
    }
}

module.exports = {
    AddUser,
    GetUser,
    GetUserNames
}