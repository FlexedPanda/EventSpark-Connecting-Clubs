import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import Apply from "../models/apply.model.js";
import Event from "../models/event.model.js";
import Refer from "../models/refer.model.js";
import User from "../models/user.model.js";
import Sponsor from "../models/sponsor.model.js";
import Guest from "../models/guest.model.js";
import Club from "../models/club.model.js";
import Register from "../models/register.model.js";
import Post from "../models/post.model.js";

export const registers = async (req, res) => {
	try {
		const registers = await Register.find().populate("club");
		res.status(200).json({
			success: true,
			message: "Registrations Fetched Successfully",
			registers,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

export const accept = async (req, res) => {
	try {
		const request = await Register.findById(req.params.id);
		if (!request) {
			return res.status(404).json({
				success: false,
				message: "Registration Does Not Exist",
			});
		}

		const hashedPassword = await bcryptjs.hash(request.password, 12);
		const guest = new Guest({
			name: request.name,
			role: "Guest",
			credits: 1000,
			phone: request.phone,
			email: request.email,
			password: hashedPassword,
		});

		if (request.club) guest.club = request.club;
		await guest.save();
		await Register.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			message: "Referral Approved Successfully",
			guest,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

export const reject = async (req, res) => {
	try {
		const request = await Register.findById(req.params.id);
		if (!request) {
			return res.status(404).json({
				success: false,
				message: "Registration Does Not Exist",
			});
		}

		await Register.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			message: "Registration Rejected Successfully",
			request,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

export const applys = async (req, res) => {
	try {
		const requests = await Apply.find().populate({
			path: "event",
			populate: {
				path: "club",
			},
		});

		const applys = requests.filter(
			(request) =>
				request.event.club._id.toString() === req.user.club._id.toString()
		);

		res.status(200).json({
			success: true,
			message: "Applications Fetched Successfully",
			applys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

export const refer = async (req, res) => {
	try {
		const request = await Apply.findById(req.params.id);
		if (!request) {
			return res.status(404).json({
				success: false,
				message: "Application Does Not Exist",
			});
		}

		const event = await Event.findById(request.event);
		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event Does Not Exist",
			});
		}

		const refer = new Refer({
			name: request.name,
			company: request.company,
			event: request.event,
			panel: req.user._id,
			club: req.user.club,
			phone: request.phone,
			email: request.email,
			password: request.password,
		});

		await refer.save();
		await Apply.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			message: "Application Referred Successfully",
			refer,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

export const defer = async (req, res) => {
	try {
		const request = await Apply.findById(req.params.id);
		if (!request) {
			return res.status(404).json({
				success: false,
				message: "Application Does Not Exist",
			});
		}

		await Apply.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			message: "Application Deferred Successfully",
			request,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

export const refers = async (req, res) => {
	try {
		const refers = await Refer.find().populate("event panel club");
		res.status(200).json({
			success: true,
			message: "Referrals Fetched Successfully",
			refers,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

export const approve = async (req, res) => {
	try {
		const request = await Refer.findById(req.params.id);
		if (!request) {
			return res.status(404).json({
				success: false,
				message: "Referral Does Not Exist",
			});
		}

		const event = await Event.findById(request.event);
		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event Does Not Exist",
			});
		}

		const hashedPassword = await bcryptjs.hash(request.password, 12);
		const sponsor = new Sponsor({
			name: request.name,
			role: "Sponsor",
			credits: 10000,
			phone: request.phone,
			email: request.email,
			password: hashedPassword,
			company: request.company,
			funds: 0,
			sponsored: request.event,
		});

		await sponsor.save();
		await Refer.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			message: "Referral Approved Successfully",
			sponsor,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

export const decline = async (req, res) => {
	try {
		const request = await Refer.findById(req.params.id);
		if (!request) {
			return res.status(404).json({
				success: false,
				message: "Referral Does Not Exist",
			});
		}

		await Refer.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			message: "Referral Declined Successfully",
			request,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

export const check = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate("club");
		if (!user.club || !user.club.event) {
			return res.status(400).json({
				success: false,
				message: "Event Does Not Exist",
			});
		}

		const posts = await Post.find({ author: req.user._id }).countDocuments();
		return res.status(200).json({
			success: true,
			message: "Post Checked Successfully",
			posts,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

export const post = async (req, res) => {
	try {
		const posted = await Post.findOne({
			title: req.body.title,
			content: req.body.content,
		});
		if (posted) {
			return res.status(400).json({
				success: false,
				message: "Post Already Exists",
			});
		}

		const user = await User.findById(req.user._id).populate("club");
		if (!user.club || !user.club.event) {
			return res.status(400).json({
				success: false,
				message: "Post Not Allowed",
			});
		}

		const post = new Post({
			title: req.body.title,
			content: req.body.content,
			author: user._id,
			club: user.club._id,
			event: user.club.event._id,
		});

		await post.save();
		res.status(201).json({
			success: true,
			message: "Post Created Successfully",
			post,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

export const posts = async (req, res) => {
	try {
		const posts = await Post.find().populate("author club event");
		res.status(200).json({
			success: true,
			message: "Posts Fetched Successfully",
			posts,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};
