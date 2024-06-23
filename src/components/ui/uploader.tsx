/* eslint-disable @typescript-eslint/no-explicit-any */
import {useRef, useState} from "react";
import {FiEdit} from "react-icons/fi";
import {LuUpload} from "react-icons/lu";

type UploadProps = {
    image_url?: string;
    name?: string;
    setFile?: (value: File) => void;
};

const Uploader = ({image_url, name, setFile}: UploadProps) => {
    const [selectedFile, setselectedFile] = useState<File>();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleOnChange = (event: any) => {
        if (event.target.files && event.target.files.length > 0) {
            setselectedFile(event.target.files[0]);
            setFile?.(event.target.files[0]);
        }
    };

    const onChooseFile = () => {
        inputRef.current?.click();
    };

    return image_url || selectedFile ? (
        <div
            className="flex justify-between items-center border  border-black border-opacity-20 p-1 shadow-sm rounded-sm cursor-pointer"
            onClick={onChooseFile}
        >
            <div className="flex gap-2 items-center">
                {selectedFile ? (
                    <img src={URL.createObjectURL(selectedFile)} className="h-7"/>
                ) : (
                    <img src={image_url} className="h-7" alt="#"/>
                )}

                {selectedFile ? (
                    <h1 className="text-sm">{selectedFile ? selectedFile?.name : ""}</h1>
                ) : (
                    <h1 className="text-sm">{name ? name : "file-name"}</h1>
                )}
            </div>

            <div>
                <FiEdit className="text-[18px] text-amber-700 opacity-60 font-bold"/>
            </div>

            <input
                type="file"
                className="hidden"
                accept=".png,.jpeg,.jpg"
                ref={inputRef}
                onChange={handleOnChange}
            />
        </div>
    ) : (
        <div
            className="flex justify-center items-center gap-1 border border-black border-opacity-20 p-[6px] shadow-sm rounded-sm cursor-pointer"
            onClick={onChooseFile}
        >
            <input
                type="file"
                className="hidden"
                ref={inputRef}
                accept=".png,.jpeg,.jpg"
                onChange={handleOnChange}
            />

            <LuUpload className="text-[17px]"/>
            <span>Upload image</span>
        </div>
    );
};

export default Uploader;
