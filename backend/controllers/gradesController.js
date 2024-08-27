const { StatusCodes } = require("http-status-codes");


const Grade = require('../schemas/Grade');
const User = require('../schemas/User');


const AddGrade = async (req, res) =>{
    try{
        const {name, grade, weight, user_id} = req.body;
        
        const grade_ = await Grade.create(
            {
                name,
                grade,
                weight,
                user_id
            }
        );

        const user = await User.findById(user_id);
        user.grades = user.grades.concat(grade_._id);
        await user.save();

        res.status(StatusCodes.CREATED).json(grade_);
    }
    catch(error){
        console.log(error)
        res.status(StatusCodes.BAD_REQUEST).send("error creating grade")
    }
}

const GetGrades = async(req, res) => {
    try{
        const {user_id} = req.query;
        const grades = await Grade.find({user_id: user_id})
        res.status(StatusCodes.OK).json(grades);
    }
    catch(error){
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("internal error, probably could not connect to db");
    }
}

const DeleteGrade = async(req, res) => {
    try{
        const {id} = req.params;
        const grade = await Grade.findByIdAndDelete(id);
        const user = await User.findById(grade.user_id);
        user.grades = user.grades.filter((gid) => gid !== id);
        await user.save();
        res.status(StatusCodes.OK).json(grade);
    }
    catch(error){
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).send("expected a request with id in request params of a valid resource, but got " + req);
    }
}

const GetGrade = async(req, res) => {
    try{
        const {id} = req.params
        const grade = await Grade.findById(id);

        res.status(StatusCodes.OK).json(grade);
    }
    catch(error){
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).send("expected a request with id in request params of a valid resource, but got " + req);
    }
}

const UpdateGrade = async(req, res) => {
    try{

        const {id} = req.params;

        const updated_fields = req.body;
        
        await Grade.updateOne({_id: id}, {$set: updated_fields}, {new: false});

        const grade = await Grade.findById(id);

        res.status(StatusCodes.OK).json(grade);
    }
    catch(error){
        console.log(error);
        res.status(StatusCodes.NOT_FOUND).send("grade does not exist");
    }
}

 module.exports= {
    AddGrade,
    GetGrades,
    DeleteGrade,
    GetGrade,
    UpdateGrade
}