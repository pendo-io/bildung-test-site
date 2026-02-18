/**
 * App-wide bot that navigates pages, clicks elements, fills forms.
 * Designed to simulate realistic user activity for Pendo analytics.
 */

type BotAction =
  | { type: "navigate"; path: string; label: string }
  | { type: "click"; selector: string; label: string }
  | { type: "wait"; ms: number }
  | { type: "form"; formId: string; label: string };

// Random data generators
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const firstNames = ["James", "Sarah", "Michael", "Emily", "Robert", "Lisa", "David", "Jennifer", "Daniel", "Maria", "Chris", "Amanda", "Kevin", "Rachel", "Brian"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Anderson", "Taylor", "Thomas", "Lee", "Wilson"];
const companies = ["Acme Corp", "Global Enterprises", "Tech Innovators", "Retail Giants Inc", "Pacific Trading Co", "Summit Holdings", "Nexus Systems", "Pinnacle Group", "Atlas Logistics", "Vanguard Industries"];
const departments = ["operations", "technology", "hr", "finance", "logistics", "sales"];
const locations = ["atlanta", "louisville", "dallas", "chicago", "remote"];
const vendors = ["office-depot", "tech-solutions", "industrial-supply", "fleet-maintenance", "global-logistics"];
const categories = ["office-supplies", "it-equipment", "fleet-parts", "warehouse", "services"];
const roles = ["Senior Logistics Manager", "Data Analyst", "Fleet Coordinator", "Warehouse Supervisor", "Software Engineer", "Operations Manager", "Supply Chain Analyst", "HR Specialist"];

export interface AppBotCallbacks {
  navigate: (path: string) => void;
  // Page-specific form openers
  openAddOpportunity?: () => void;
  openAddPO?: () => void;
  openAddEmployee?: () => void;
  // Form data setters (will be called with random data objects)
  fillAndSubmitOpportunity?: (data: Record<string, any>) => void;
  fillAndSubmitPO?: (data: Record<string, any>) => void;
  fillAndSubmitEmployee?: (data: Record<string, any>) => void;
  // Click detail items
  clickOpportunity?: (id: string) => void;
  clickPO?: (id: string) => void;
  clickEmployee?: (id: string) => void;
}

// Sequences of actions the bot can take
function generateBrowseSequence(): BotAction[] {
  const sequences: BotAction[][] = [
    // Browse dashboard, then go to Lead to Cash
    [
      { type: "navigate", path: "/", label: "Dashboard" },
      { type: "wait", ms: 2500 },
      { type: "navigate", path: "/lead-to-cash", label: "Lead to Cash" },
      { type: "wait", ms: 2000 },
      { type: "click", selector: "opportunity-row", label: "View opportunity" },
      { type: "wait", ms: 3000 },
    ],
    // Browse Source to Pay, create PO
    [
      { type: "navigate", path: "/source-to-pay", label: "Source to Pay" },
      { type: "wait", ms: 2000 },
      { type: "form", formId: "add-po", label: "Create Purchase Order" },
      { type: "wait", ms: 2000 },
    ],
    // Browse Hire to Retire, view employee, add employee
    [
      { type: "navigate", path: "/hire-to-retire", label: "Hire to Retire" },
      { type: "wait", ms: 2000 },
      { type: "click", selector: "employee-row", label: "View employee" },
      { type: "wait", ms: 3000 },
      { type: "navigate", path: "/hire-to-retire", label: "Back to HR" },
      { type: "wait", ms: 1500 },
      { type: "form", formId: "add-employee", label: "Add Employee" },
      { type: "wait", ms: 2000 },
    ],
    // Browse Lead to Cash, add opportunity
    [
      { type: "navigate", path: "/lead-to-cash", label: "Lead to Cash" },
      { type: "wait", ms: 2000 },
      { type: "form", formId: "add-opportunity", label: "Add Opportunity" },
      { type: "wait", ms: 2000 },
    ],
    // Dashboard only browsing
    [
      { type: "navigate", path: "/", label: "Dashboard" },
      { type: "wait", ms: 3000 },
      { type: "navigate", path: "/source-to-pay", label: "Source to Pay" },
      { type: "wait", ms: 2500 },
      { type: "click", selector: "po-row", label: "View PO" },
      { type: "wait", ms: 3000 },
    ],
    // Full tour
    [
      { type: "navigate", path: "/", label: "Dashboard" },
      { type: "wait", ms: 2000 },
      { type: "navigate", path: "/lead-to-cash", label: "Lead to Cash" },
      { type: "wait", ms: 2000 },
      { type: "navigate", path: "/source-to-pay", label: "Source to Pay" },
      { type: "wait", ms: 2000 },
      { type: "navigate", path: "/hire-to-retire", label: "Hire to Retire" },
      { type: "wait", ms: 2000 },
      { type: "navigate", path: "/bill-guard", label: "Bill Guard" },
      { type: "wait", ms: 2000 },
    ],
  ];
  return pick(sequences);
}

function generateOpportunityData(): Record<string, any> {
  return {
    company: pick(companies),
    contactName: `${pick(firstNames)} ${pick(lastNames)}`,
    contactEmail: `${pick(firstNames).toLowerCase()}.${pick(lastNames).toLowerCase()}@${pick(companies).toLowerCase().replace(/\s+/g, "")}.com`,
    value: String(randInt(50000, 5000000)),
    stage: pick(["lead", "qualification", "discovery", "proposal", "negotiation"]),
    source: pick(["website", "referral", "cold-call", "trade-show", "partner"]),
    description: `${pick(companies)} is interested in enterprise logistics solutions for their ${pick(["Q1", "Q2", "Q3", "Q4"])} expansion.`,
    expectedCloseDate: new Date(Date.now() + randInt(30, 180) * 86400000).toISOString().split("T")[0],
  };
}

function generatePOData(): Record<string, any> {
  return {
    vendor: pick(vendors),
    category: pick(categories),
    priority: pick(["low", "medium", "high", "urgent"]),
    amount: String(randInt(1000, 100000)),
    description: `${pick(["Monthly supply order", "Emergency restock", "Quarterly procurement", "New equipment request", "Maintenance parts order"])} for ${pick(["warehouse operations", "fleet maintenance", "office supplies", "IT infrastructure"])}`,
    deliveryDate: new Date(Date.now() + randInt(7, 60) * 86400000).toISOString().split("T")[0],
    department: pick(["Operations", "Technology", "Logistics", "Finance"]),
    costCenter: `CC-${randInt(1000, 9999)}`,
  };
}

function generateEmployeeData(): Record<string, any> {
  const first = pick(firstNames);
  const last = pick(lastNames);
  return {
    firstName: first,
    lastName: last,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@ups.com`,
    phone: `+1 (${randInt(200, 999)}) ${randInt(100, 999)}-${randInt(1000, 9999)}`,
    role: pick(roles),
    department: pick(departments),
    employmentType: pick(["full-time", "full-time", "full-time", "contract"]),
    location: pick(locations),
    startDate: new Date(Date.now() + randInt(7, 30) * 86400000).toISOString().split("T")[0],
    salary: String(randInt(45000, 180000)),
    manager: `${pick(firstNames)} ${pick(lastNames)}`,
    notes: "",
  };
}

// Existing PO/opportunity/employee IDs to click on
const existingOpportunityIds = ["OPP-2024-456", "OPP-2024-455", "OPP-2024-454", "OPP-2024-453"];
const existingPOIds = ["PO-2024-0892", "PO-2024-0891", "PO-2024-0890", "PO-2024-0889", "PO-2024-0888"];
const existingEmployeeIds = ["EMP-45678", "EMP-45677", "EMP-45676", "EMP-45675"];

export async function runBotSequence(
  callbacks: AppBotCallbacks,
  shouldStop: () => boolean,
): Promise<void> {
  const sequence = generateBrowseSequence();
  
  for (const action of sequence) {
    if (shouldStop()) return;
    
    switch (action.type) {
      case "navigate":
        console.log(`[AppBot] Navigating to ${action.label} (${action.path})`);
        callbacks.navigate(action.path);
        break;
        
      case "wait":
        await new Promise((r) => setTimeout(r, action.ms));
        break;
        
      case "click":
        console.log(`[AppBot] Clicking: ${action.label}`);
        if (action.selector === "opportunity-row" && callbacks.clickOpportunity) {
          callbacks.clickOpportunity(pick(existingOpportunityIds));
        } else if (action.selector === "po-row" && callbacks.clickPO) {
          callbacks.clickPO(pick(existingPOIds));
        } else if (action.selector === "employee-row" && callbacks.clickEmployee) {
          callbacks.clickEmployee(pick(existingEmployeeIds));
        }
        break;
        
      case "form":
        console.log(`[AppBot] Filling form: ${action.label}`);
        if (action.formId === "add-opportunity" && callbacks.fillAndSubmitOpportunity) {
          callbacks.fillAndSubmitOpportunity(generateOpportunityData());
        } else if (action.formId === "add-po" && callbacks.fillAndSubmitPO) {
          callbacks.fillAndSubmitPO(generatePOData());
        } else if (action.formId === "add-employee" && callbacks.fillAndSubmitEmployee) {
          callbacks.fillAndSubmitEmployee(generateEmployeeData());
        }
        break;
    }
  }
}

export { generateBrowseSequence, generateOpportunityData, generatePOData, generateEmployeeData };
