export const MONITOR_TYPES = ["http", "ping"];
export type MonitorType = typeof MONITOR_TYPES[number];

export function isMonitorType(type: any): type is MonitorType {
	return MONITOR_TYPES.includes(type);
}