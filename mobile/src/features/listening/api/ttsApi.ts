import api from "../../../shared/api";

export async function getTts(text:string) {
    const response = await api.post('api/tts',{text});
    return response.data;
}