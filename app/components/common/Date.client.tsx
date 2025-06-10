export const DateDisplay = ({ date }: { date: string }) => {
    return <span>{new Date(date).toLocaleDateString()}</span>
}