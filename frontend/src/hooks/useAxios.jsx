import axios from "axios";
import { useCallback } from "react";

const useAxios = () => {
	const axiosInstance = axios.create({
		baseURL: import.meta.env.VITE_API_URL,
		headers: {
			"Content-Type": "application/json",
		},
	});

	axiosInstance.interceptors.request.use(
		(config) => {
			const token = localStorage.getItem("token");
			if (token) config.headers.token = token;

			const type = localStorage.getItem("type");
			if (type) config.headers.type = type;
			
			if (config.headers["Content-Type"] === "multipart/form-data") delete config.headers["Content-Type"];
			return config;
		},
		(error) => Promise.reject(error)
	);

	axiosInstance.interceptors.response.use(
		(response) => response.data,
		(error) => Promise.reject(error.response || error.message)
	);

	const get = useCallback(
		(url, config = {}) => axiosInstance.get(url, config),
		[]
	);
	const post = useCallback(
		(url, data, config = {}) => axiosInstance.post(url, data, config),
		[]
	);
	const put = useCallback(
		(url, data, config = {}) => axiosInstance.put(url, data, config),
		[]
	);
	const del = useCallback(
		(url, config = {}) => axiosInstance.delete(url, config),
		[]
	);

	return { get, post, put, del };
};

export default useAxios;
