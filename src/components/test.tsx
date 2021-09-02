import Upload from "./upload";
import { useState } from "react";
export default function Test() {
    const [file, setFile] = useState<any>([]);
    const hanldeChange = (event: any) => {
        const file = event.target.files[0]
        setFile([file])
        console.log(file)
    }
    const handleClick = () => {

        Upload(file)
    }
    return (
        <div>
            <input type='file' onChange={(event) => hanldeChange(event)} />
            <button onClick={handleClick}>upload</button>
        </div>
    )
}