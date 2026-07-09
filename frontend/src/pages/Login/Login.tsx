import React, {useEffect} from "react";
import http from "../../common/http";
import {useNavigate} from "react-router-dom";
import Input from "../../common/components/Input";
import Button from "../../common/components/Button";
import type IAccount from "../../types/accounts/IAccount";

export default function Login({setCurrentAccountType}) {
    const [errorMessage, setErrorMessage] = React.useState<{
        color: string;
        message: string;
    }>();
    const [errorShown, setErrorShown] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const usernameRef = React.createRef<HTMLInputElement>();
    const passwordRef = React.createRef<HTMLInputElement>();

    const navigate = useNavigate();

    useEffect(() => {
        const isVerified = async () => {
            if ((await http("/api/verify", "POST")).status === 200) {
                const account: IAccount = await (await http("/api/account/current", "GET")).json();
                setCurrentAccountType(account.type);
                navigate("/");
            }
        };
        isVerified();
    }, []);

    const setErrorText = (message: string, color: string): void => {
        setErrorMessage({
            color: color,
            message: message,
        });
        setErrorShown(true);
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        if (isSubmitting) return;

        let username = usernameRef.current.value;
        let password = passwordRef.current.value;

        setIsSubmitting(true);

        const request = await http("/api/login", "POST", {
            username: username,
            password: password,
        });

        if (request.status === 200) {
            const account: IAccount = await (await http("/api/account/current", "GET")).json();
            if (!account) {
                setErrorText("Er is een probleem met inloggen. Het account kan niet gevonden worden.", "--color-red");
                return;
            }
            setCurrentAccountType(account.type);
            navigate("/");
            return;
        }

        const response = await request.json();
        let message = response[0];

        if (request.status) {
            if (request.status == 401) {
                setErrorText(message, "--color-red");
            } else if (request.status == 200) {
                setErrorText(message, "--color-green");
            } else {
                setErrorText(message, "--color-red");
            }
        } else {
            setErrorText("Server reageert niet", "--color-red");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div
                className="py-12.5 px-10 flex flex-col w-full max-w-110 rounded-4xl bg-(--color-white)
                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent),0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)]
                    animate-[fade-in_0.3s_ease-in-out] transition-all duration-400">
                <div className="mb-15 flex flex-col items-center gap-3">
                    <h1 className="text-[32px] font-bold text-(--color-darkblue)">Welkom terug</h1>

                    <p className="text-[18px] font-medium text-(--color-orange)">Log in op je dashboard</p>
                </div>

                <form className="flex flex-col" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-6">
                        <Input
                            label="Gebruikersnaam"
                            id="username"
                            placeholder="Gebruikersnaam"
                            ref={usernameRef}
                            type="text"
                        />

                        <Input
                            label="Wachtwoord"
                            id="password"
                            placeholder="Wachtwoord"
                            ref={passwordRef}
                            type="password"
                        />
                    </div>

                    <p
                        key={errorMessage?.message}
                        className={`mt-2 mb-8 ml-1.5 min-h-6 text-[14px font-medium
                            text-(${errorShown ? errorMessage.color : "--color-white"}) ${
                                errorShown ? "animate-[fade-in_0.3s_ease-in-out]" : ""
                            }`}>
                        {errorShown ? errorMessage.message : ""}
                    </p>

                    <Button>Inloggen</Button>
                </form>
            </div>
        </div>
    );
}
