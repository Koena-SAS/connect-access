import axios from "axios";
import { keysToCamel } from "../utils";

const fetcherWithToken = (url: string, token: string) =>
  axios
    .get(url, {
      headers: {
        Authorization: `token ${token}`,
      },
    })
    .then((res) => keysToCamel(res.data));

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export { fetcherWithToken, fetcher };
