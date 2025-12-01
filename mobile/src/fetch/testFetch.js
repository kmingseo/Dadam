import axios from 'axios'
import { REACT_APP_SPRING_API } from '@env';

export const testFetch = async () => {
    try {
        const res = await axios.get(
            `${REACT_APP_SPRING_API}/test`);
        return res.data;
    } catch (err) {
        console.error(err);
        console.log('??');
        return "실패";
    }
};