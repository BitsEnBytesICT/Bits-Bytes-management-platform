const dummyFooterDataOne = [
    {
        id: "1",
        text: "Totaal aantal accounts op de windows server",
        link: "url hier",
    },
    {
        id: "2",
        text: "admin accounts",
        link: "url hier",
    },
];
const dummyFooterDataTwo = [
    {
        id: "1",
        text: "Snelkoppelingen",
        link: "een",
    },
];
const dummyFooterDataThree = [
    {
        id: "1",
        text: "Plattegrond",
        link: "een",
    },
];
const dummyFooterDataFour = [
    {
        id: "1",
        text: "Agenda",
        link: "een",
    },
];
const dummyFooterDataFive = [
    {
        id: "1",
        text: "Table met alle accounts",
        link: "een",
    },
];

export default function IctBottomFooter() {
    return (
        <>
            <div className="flex gap-10 justify-between text-(--color-darkblue) text-lg">
                <div className="flex flex-col gap-6">
                    {dummyFooterDataOne.map(een => {
                        return (
                            <div key={een.id}>
                                <a href="https://www.google.com">{een.text}</a>
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-col gap-6">
                    {dummyFooterDataTwo.map(twee => {
                        return (
                            <div key={twee.id}>
                                <h1>{twee.text}</h1>
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-col gap-6">
                    {dummyFooterDataThree.map(drie => {
                        return (
                            <div key={drie.id}>
                                <h1>{drie.text}</h1>
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-col gap-6">
                    {dummyFooterDataFour.map(vier => {
                        return (
                            <div key={vier.id}>
                                <h1>{vier.text}</h1>
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-col gap-6">
                    {dummyFooterDataFive.map(vijf => {
                        return (
                            <div key={vijf.id}>
                                <h1>{vijf.text}</h1>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
