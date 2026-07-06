export default function Login() {
    //verder nog geen hooks of functies

    return (
        <div className="flex min-h-screen items-center justify-center bg-(--color-offwhite) p-6">
            <div className="flex w-full max-w-[28rem] flex-col gap-10 rounded-[2rem] bg-(--color-white) p-10 shadow-lg">
                <div className="flex flex-col items-center gap-3">
                    <h1 className="text-[32px] font-bold text-(--color-darkblue)">Welkom terug</h1>

                    <p className="text-[18px] font-medium text-(--color-orange)">Log in op je dashboard</p>
                </div>

                <form className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[16px] font-semibold text-(--color-darkblue)" htmlFor="username">
                            Gebruikersnaam
                        </label>

                        <input
                            className="rounded-xl border border-(--color-lightblue) bg-(--color-offwhite) px-5 py-3
                                text-[16px] text-(--color-offblack) outline-none transition-colors
                                focus:border-(--color-darkblue)"
                            id="username"
                            type="text"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[16px] font-semibold text-(--color-darkblue)" htmlFor="password">
                            Wachtwoord
                        </label>

                        <input
                            className="rounded-xl border border-(--color-lightblue) bg-(--color-offwhite) px-5 py-3
                                text-[16px] text-(--color-offblack) outline-none transition-colors
                                focus:border-(--color-darkblue)"
                            id="password"
                            type="password"
                        />

                        {/* <p className="text-[14px] font-medium text-(--color-red)">Foutmelding komt hier te staan..</p> */}
                    </div>

                    <button
                        className="w-full rounded-xl bg-(--color-darkblue) py-4 text-[18px] font-semibold
                            text-(--color-white) transition-colors hover:bg-(--color-darkblue)/90"
                        type="button">
                        Inloggen
                    </button>
                </form>
            </div>
        </div>
    );
}
