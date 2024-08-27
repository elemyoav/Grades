const { StatusCodes } = require("http-status-codes");

const User = require('../schemas/User');

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
    GetUser
}