import axios from "axios";
import { keysToCamel } from "../utils";

const fetcherWithToken = (url, token) =>
  axios
    .get(url, {
      headers: {
        Authorization: `token ${token}`,
      },
    })
    .then((res) => keysToCamel(res.data));

const fetcher = (url) => axios.get(url).then((res) => res.data);

export { fetcherWithToken, fetcher };
