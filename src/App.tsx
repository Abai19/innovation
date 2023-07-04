import React, { useEffect, useState } from 'react';
import ContributionGraph from './components/ContributionGraph';

const App: React.FC = () => {
    const [data, setData] = useState<{ [date: string]: number }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://dpg.gg/test/calendar.json');
                const jsonData = await response.json();
                const today = new Date();
                const cutoffDate = new Date(today.getTime() - 50 * 7 * 24 * 60 * 60 * 1000);
                const filteredData: { [date: string]: number } = {};

                for (const date in jsonData) {
                    const currentDate = new Date(date);
                    if (currentDate >= cutoffDate && currentDate <= today) {
                        filteredData[date] = jsonData[date];
                    }
                }

                setData(filteredData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Contribution Graph</h1>
            <ContributionGraph data={data} />
        </div>
    );
};

export default App;
