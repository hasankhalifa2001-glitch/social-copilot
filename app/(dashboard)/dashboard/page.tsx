export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Posts", value: "0" },
                    { label: "Scheduled", value: "0" },
                    { label: "Connected Accounts", value: "0" },
                ].map((stat) => (
                    <div key={stat.label} className="p-6 bg-background border rounded-lg shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="p-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-muted p-4 rounded-full">
                    <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium">No posts yet</h3>
                <p className="text-muted-foreground max-w-xs">
                    Start by creating your first post to see it scheduled here.
                </p>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
                    Create Your First Post
                </button>
            </div>
        </div>
    );
}
