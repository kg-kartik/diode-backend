import Instances from "./Instances";

interface Users {
    _id?: string;
    personalaccesstoken: string;
    instances: Array<Instances>;
}

export default Users;
