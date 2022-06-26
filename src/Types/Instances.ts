interface Instances {
    instanceId?: string;
    ip_address?: string;
    ssh_key?: string;
    region: string;
    type: string;
    name: string;
    buildpack?: string;
    repo?: string;
    env?: Array<{
        key: string;
        value: string;
    }>;
}

export default Instances;
