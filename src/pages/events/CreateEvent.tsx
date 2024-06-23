import {Navbar} from "@/components";
import {EventForm} from "@/components/forms";

const CreateEvent = () => {
    return (
        <>
            <Navbar name={"Tanlov yaratish"}/>

            <EventForm action={"CREATE"}/>
        </>
    )
};

export default CreateEvent;