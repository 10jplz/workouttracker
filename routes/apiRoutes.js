const router = require("express").Router();
const Workout = require("../models/workout.js");
const mongoose = require("mongoose");
const { json } = require("express")

router.post("/api/workouts", ({data}, res) => {
  
  Workout.create(data)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.put("/api/workouts/:id", (req, res) => {
  
  Workout.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    $push: { exercises: req.body },
  })
    .then(workout => {
      res.json(workout);
    })
    .catch(e => console.log(e));
});

router.get("/api/workouts", (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: "$exercises.duration",
        },
      },
    },
  ])
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});
router.get("/api/workouts/range", (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: "$exercises.duration",
        },
      },
    },
  ])
    .sort({ _id: -1 })
    .limit(7)
    .then(dbWorkouts => {
      console.log(dbWorkouts);
      res.json(dbWorkouts);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;