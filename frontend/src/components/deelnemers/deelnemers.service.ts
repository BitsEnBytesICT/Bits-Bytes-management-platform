import http from "../../common/http";

export default class DeelnemersService {
    testBackend = async () => {
        let data = [];
        await http("/users", "PUT", {firstName: "test", lastName: "test", age: "30", bday: "1-1-2000"}).then(
            async res => {
                if (res.status === 200) data.push(res.status);
                else data.push(await res.json());
            },
        );

        await http("/users", "PUT", {firstName: "test", lastName: "test"}).then(async res => {
            if (res.status === 200) data.push(res.status);
            else data.push(await res.json());
        });

        await http("/users", "PUT", {firstName: "test"}).then(async res => {
            if (res.status === 200) data.push(res.status);
            else data.push(await res.json());
        });

        await http("/users", "PUT", {lastName: "test"}).then(async res => {
            if (res.status === 200) data.push(res.status);
            else data.push(await res.json());
        });

        await http("/users", "PUT", {firstName: "test", lastName: "test", age: "-10", bday: "20-20-2000"}).then(
            async res => {
                if (res.status === 200) data.push(res.status);
                else data.push(await res.json());
            },
        );

        console.log(data);
        return data;
    };
}
