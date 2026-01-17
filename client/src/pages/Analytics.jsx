import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendUp, TrendDown, CurrencyInr, Package, Warning } from 'phosphor-react';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalValue: 0,
        avgPrice: 0,
        lowStockCount: 0,
        categoryDist: [],
        stockTrends: [],
        insight: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/products');
            processData(res.data);
        } catch (error) {
            console.error("Analytics fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const processData = (data) => {
        if (!data || data.length === 0) return;

        const totalProducts = data.length;
        const totalValue = data.reduce((acc, p) => acc + (p.sellingPrice * p.stock), 0);
        const avgPrice = totalValue / (data.reduce((acc, p) => acc + Number(p.stock), 0) || 1);
        const lowStockCount = data.filter(p => p.stock < 10).length;

        // 1. Category Distribution (Value based)
        const catMap = {};
        data.forEach(p => {
            const existing = catMap[p.type] || 0;
            catMap[p.type] = existing + (p.sellingPrice * p.stock);
        });
        const categoryDist = Object.keys(catMap).map(key => ({
            name: key,
            value: catMap[key]
        })).sort((a, b) => b.value - a.value);

        // 2. Stock Levels (Top 10)
        const stockTrends = data
            .sort((a, b) => (b.stock * b.sellingPrice) - (a.stock * a.sellingPrice)) // Sort by Value
            .slice(0, 10)
            .map(p => ({
                name: p.name,
                stock: p.stock,
                price: p.sellingPrice,
                value: p.sellingPrice * p.stock
            }));

        // 3. AI Smart Insight
        const topCat = categoryDist.length > 0 ? categoryDist[0].name : "None";
        const insight = `Your inventory is dominated by **${topCat}**, which accounts for majority of your asset value. You have **${lowStockCount}** products needing immediate restocking.`;

        setStats({ totalProducts, totalValue, avgPrice, lowStockCount, categoryDist, stockTrends, insight });
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl z-50">
                    <p className="text-sm font-bold text-gray-800 mb-2 border-b pb-2">{label}</p>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500">Stock Qty: <span className="font-medium text-gray-800">{data.stock} units</span></p>
                        <p className="text-xs text-gray-500">Unit Price: <span className="font-medium text-gray-800">₹{data.price}</span></p>
                        <div className="pt-2 mt-2 border-t flex justify-between gap-4">
                            <span className="text-xs font-bold text-blue-600">Total Asset Value:</span>
                            <span className="text-sm font-bold text-gray-900">₹{data.value.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <DashboardLayout title="Advanced Analytics">
            {loading ? (
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                </div>
            ) : (
                <div className="space-y-6 pb-12">
                    {/* Smart Insight Banner */}
                    <div className="bg-gradient-to-r from-[#0F1C50] to-[#1e3a8a] rounded-2xl p-6 text-white shadow-lg flex items-start gap-4">
                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                            <TrendUp size={24} className="text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-1">Business Intelligence</h2>
                            <p className="text-blue-100 text-sm opacity-90 leading-relaxed" dangerouslySetInnerHTML={{ __html: stats.insight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }}></p>
                        </div>
                    </div>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition">
                            <div className="overflow-hidden">
                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider truncate">Total Inventory Value</p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">₹{stats.totalValue.toLocaleString()}</h3>
                                <p className="text-[10px] text-gray-400 mt-1">Potential Revenue (Stock × Price)</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-100 transition flex-shrink-0"><CurrencyInr size={24} className="text-blue-600" /></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition">
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Active Products</p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalProducts}</h3>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-full group-hover:bg-purple-100 transition"><Package size={24} className="text-purple-600" /></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition">
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Avg. Unit Price</p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">₹{Math.round(stats.avgPrice).toLocaleString()}</h3>
                            </div>
                            <div className="bg-green-50 p-3 rounded-full group-hover:bg-green-100 transition"><TrendUp size={24} className="text-green-600" /></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition">
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Stock Alerts</p>
                                <h3 className={`text-2xl font-bold mt-1 ${stats.lowStockCount > 0 ? 'text-red-500' : 'text-gray-800'}`}>{stats.lowStockCount}</h3>
                            </div>
                            <div className={`p-3 rounded-full transition ${stats.lowStockCount > 0 ? 'bg-red-50 group-hover:bg-red-100' : 'bg-gray-50'}`}>
                                <Warning size={24} className={stats.lowStockCount > 0 ? "text-red-500" : "text-gray-400"} />
                            </div>
                        </div>
                    </div>

                    {/* Advanced Charts Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Main Chart: Stock Value per Product */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="font-bold text-gray-800">Projected Asset Value</h3>
                                    <p className="text-xs text-gray-400">Calculated as (Stock Quantity × Unit Price)</p>
                                </div>
                                <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Top 10 Assets</div>
                            </div>
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={stats.stockTrends} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                                    <defs>
                                        <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0.4} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 10 }}
                                        angle={-30}
                                        textAnchor="end"
                                        interval={0}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} tickFormatter={(val) => `₹${val}`} />
                                    <Tooltip cursor={{ fill: '#F3F4F6' }} content={<CustomTooltip />} />
                                    <Bar dataKey="value" name="Asset Value" fill="url(#colorBar)" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Secondary Chart: Category Distribution */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
                            <h3 className="font-bold text-gray-800 mb-2">Category Distribution</h3>
                            <p className="text-xs text-gray-400 mb-6">Breakdown by total asset value</p>

                            <div className="flex-1 min-h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.categoryDist}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {stats.categoryDist.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            iconType="circle"
                                            formatter={(value) => <span className="text-xs font-medium text-gray-600 ml-1">{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-4 space-y-3">
                                {stats.categoryDist.slice(0, 3).map((cat, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                            <span className="text-gray-600">{cat.name}</span>
                                        </div>
                                        <span className="font-bold text-gray-800">{(cat.value / stats.totalValue * 100).toFixed(1)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Analytics;
