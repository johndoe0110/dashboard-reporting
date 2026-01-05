export default function CampaignTable() {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800">
        
        <div className="px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-semibold">TikTok Campaigns</h2>
        </div>
  
        {/* SCROLL CONTAINER */}
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-xs">
            <thead className="bg-zinc-800 text-gray-300">
              <tr>
                <th className="px-3 py-2 text-left">Campaign</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>CPR</th>
                <th>Leads</th>
              </tr>
            </thead>
  
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="px-3 py-2">24NOV_GTT_BAJU31</td>
                <td>
                  <span className="px-2 py-1 rounded bg-green-600/20 text-green-400">
                    Active
                  </span>
                </td>
                <td>Rp 1.000.000</td>
                <td>Rp 571.920</td>
                <td>Rp 114.384</td>
                <td>5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  