import {Route, Routes} from "react-router-dom";
import {AuthLayout, RootLayout} from "./layouts";
import {Dashboard, NotFound} from "./pages";
import {AuthChecker} from "./middlewares";
import {CreateEvent, EditEvent, Events, InternalServerError} from "@/pages";
import Channels from "@/pages/Channels.tsx";

function App() {
    return (
        <Routes>
            {/* Root layout */}
            <Route
                element={
                    <AuthChecker>
                        <RootLayout/>
                    </AuthChecker>
                }
            >
                <Route index element={<Dashboard/>}/>

                <Route path={'/events'} element={<Events/>}/>
                <Route path={'/event/create'} element={<CreateEvent/>}/>
                <Route path={'/event/edit/:eventId'} element={<EditEvent/>}/>

                <Route path={'/channels'} element={<Channels/>}/>

                <Route path={'/500'} element={<InternalServerError/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Route>

            {/* Auth layout */}
            <Route path="/auth" element={<AuthLayout/>}/>
        </Routes>
    );
}

export default App;
