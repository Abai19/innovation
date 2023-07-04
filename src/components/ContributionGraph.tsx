import React, { useState } from 'react';

interface ContributionGraphProps {
    data: { [date: string]: number };
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({ data }) => {
    const [hint, setHint] = useState({ date: '', contributions: 0, position: { left: 0, top: 0 } });
    const handleCellClick = (date: string, contributions: number, position: { left: number, top: number }) => {
        setHint({ date, contributions, position });
    };
    const weekDays = ['ПН', 'ВТ', 'СТ', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
    const months = [
        'Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь',
        'Июль', 'Авг', 'Сен', 'Окт', 'Нояб', 'Дек'
    ];

    const getColor = (contributions: number): string => {
        if (contributions === 0) {
            return '#EDEDED';
        } else if (contributions >= 30) {
            return '#254E77'; 
        } else if (contributions >= 20) {
            return '#527BA0'; 
        } else if (contributions >= 10) {
            return '#7FA8C9'; 
        } else {
            return '#ACD5F2';
        }
    };

    const generateCells = () => {
        const today = new Date();
        const startDate = new Date(today.getTime() - 50 * 7 * 24 * 60 * 60 * 1000);
        const cells = [];

        const monthHeaders = months.map((month, index) => (
            <th key={index} colSpan={index === 0 ? 8 : 4}>{month}</th>
        ));
        cells.push(<tr key="months">{monthHeaders}</tr>);

        for (let i = 0; i < 7; i++) {
            const row = [];
            row.push(<td key={i} colSpan={4} className="week-day">{weekDays[i]}</td>);
            for (let j = 0; j < 52; j++) {
                const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000 + j * 7 * 24 * 60 * 60 * 1000);
                const dateString = date.toISOString().slice(0, 10);

                const contributions = data[dateString] || 0;
                const color = getColor(contributions);

                row.push(<td key={j}
                    className={`cell ${contributions > 0 ? 'hoverable' : ''}`}
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const position = { left: rect.left, top: rect.top };
                        handleCellClick(dateString, contributions, position);
                    }}
                    style={{ backgroundColor: color }}></td>);
            }

            cells.push(<tr key={i}>{row}</tr>);
        }

        return cells;
    };

    return (
        <div className="contribution-graph">
            <table>
                <tbody>{generateCells()}</tbody>
            </table>
            {hint.date && (
                <div
                    className="hint"
                    style={{ left: hint.position.left, top: hint.position.top }}
                >
                    <p>Contributions: {hint.contributions}</p>
                    <p>Date: {hint.date}</p>
                </div>
            )}
        </div>
    );
};

export default ContributionGraph;
