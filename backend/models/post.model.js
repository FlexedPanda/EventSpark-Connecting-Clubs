import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		title: { 
      type: String, 
      required: [true, "Title Required"],
      unique: [true, "Post Exists"], 
    },

		content: { 
      type: String, 
      required: [true, "Content Required"], 
      unique: [true, "Post Exists"],
    },

		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Panel",
			required: [true, "Author Required"],
		},

		club: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Club",
      required: [true, "Club Required"],
    },

		event: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Event", 
      required: [true, "Event Required"],
    }, 
	},
	{ 
    timestamps: true 
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
