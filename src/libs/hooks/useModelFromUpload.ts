import { FileOption } from "../ui/components";

export function useModelFromUpload(file : FileOption){
    if(file.id) return import.meta.env.VITE_API_PATH + `file/${file.id}`;



    return new Blob([file.file])
}   