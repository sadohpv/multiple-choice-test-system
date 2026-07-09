import { useEffect, useState } from "react";

function Subject() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/subjects")
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.error(err));
    }, []);
    return (
        <div>
            <h1>Subject</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default Subject;
