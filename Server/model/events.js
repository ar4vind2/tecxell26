import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Vibe Coding', 'Reel Making', 'Poster Making', 'Computer Quiz', 'Mini Miltia', 'Treasure Hunt', 'E-football'],
    },
    regFee:{
      type: String,
      required: true
    },
    loc:{
      type:String,
      required:true
    },
    currentSts:{
      type:String,
      default:'Yet to start',
      enum: ['Yet to start', 'In Progress', 'Delayed', 'Completed']
    },
    schedule:{
      type: String,
       required:true
    }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;