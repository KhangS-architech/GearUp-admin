import { BounceLoader } from "react-spinners";

export default function Spinner ({fullWidth}) {
    if (fullWidth) {
        return (
            <div className="w-full flex justify-center">
                 <BounceLoader color={'#1E3A8A'} speedMultiplier={2} />
            </div>
        )
    }
    return (
        <BounceLoader color={'#1E3A8A'} speedMultiplier={2} />
    )
}