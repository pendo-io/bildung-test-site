const visitors = [
  "Michael", "Christopher", "Jessica", "Matthew", "Ashley", "Jennifer", "Joshua", "Amanda",
  "Daniel", "David", "James", "Robert", "John", "Joseph", "Andrew", "Ryan", "Sarah", "Stephanie",
  "Rachel", "Erika", "Thomas", "Sonya", "Bill", "Tyrone", "Denise", "Brian", "Adam", "Megan",
  "Eric", "Elizabeth", "Anthony", "Nicole", "Kevin", "Melissa", "Laura", "Kyle", "Kayla", "Amber",
  "Richard", "Kim", "Jeff", "Amy", "Michelle", "Benjamin", "Mark", "Emily", "Aaron", "Charles",
  "Rebecca", "Jamie", "Erin", "Zachary", "Sean", "Mary", "Kelly", "Paul", "Dustin", "Travis",
  "Gregory", "Andrea", "Angela", "Bryan", "Shane", "Todd", "George", "Phillip", "Stacy", "Joanna",
  "Jasmine", "Brooke", "Felicity", "Tony", "Nancy", "Kate", "Jillian", "Jerry", "Luke", "Maria",
  "Cody", "Allison", "Peter", "Jordan", "Natalie", "Holly", "Jared", "Anna", "Caroline", "Amalia"
];

const roles = ["user", "admin", "read-only"] as const;

const accounts = [
  "UPS Logistics", "UPS Freight", "UPS Supply Chain", "UPS Capital", "UPS Store",
  "UPS Healthcare", "UPS Airlines", "UPS Ground", "UPS Express", "UPS International",
  "UPS Customs", "UPS Returns", "UPS Mail", "UPS Delivery", "UPS Packaging",
  "UPS Solutions", "UPS Digital", "UPS Fleet", "UPS Operations", "UPS Finance"
];

const oldAccounts = [
  "UPS Central", "UPS West", "UPS East", "UPS South", "UPS North",
  "UPS Global", "UPS Regional", "UPS Local", "UPS Corporate", "UPS Hub"
];

export type UserRole = typeof roles[number];

export interface UserInfo {
  account: string;
  visitor: string;
  visitorId: string;
  role: UserRole;
}

function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function calcPrevDate(daysAgo: number): string {
  const now = new Date();
  const prevDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);
  const month = prevDate.getMonth() + 1;
  const day = prevDate.getDate();
  return `${month < 10 ? "0" : ""}${month}${day < 10 ? "0" : ""}${day}${prevDate.getFullYear() - 2000}`;
}

function getDateBasedVisitorId(): UserInfo {
  const randomRoll = getRandomArbitrary(0, 2);
  let visitorName = "";
  let visitor = "";
  let role: UserRole = "user";
  let account_id = "";

  const dayOfWeek = new Date().getDay();

  switch (dayOfWeek) {
    case 1: // Monday
      visitorName = visitors[Math.floor(Math.random() * visitors.length)];
      visitor = `${visitorName}${calcPrevDate(0)}@`;
      break;
    case 2: // Tuesday
      if (randomRoll < 1) {
        visitorName = visitors[Math.floor(Math.random() * getRandomArbitrary(31, 38))];
        visitor = `${visitorName}${calcPrevDate(8)}@`;
      } else {
        visitorName = visitors[Math.floor(getRandomArbitrary(70, 89))];
        visitor = `${visitorName}${calcPrevDate(29)}@`;
      }
      break;
    case 3: // Wednesday
      if (randomRoll < 1) {
        visitorName = visitors[Math.floor(Math.random() * getRandomArbitrary(27, 35))];
        visitor = `${visitorName}${calcPrevDate(16)}@`;
      } else {
        visitorName = visitors[Math.floor(getRandomArbitrary(60, 89))];
        visitor = `${visitorName}${calcPrevDate(58)}@`;
      }
      break;
    case 4: // Thursday
      if (randomRoll < 1) {
        visitorName = visitors[Math.floor(Math.random() * getRandomArbitrary(23, 28))];
        visitor = `${visitorName}${calcPrevDate(24)}@`;
      } else {
        visitorName = visitors[Math.floor(getRandomArbitrary(55, 89))];
        visitor = `${visitorName}${calcPrevDate(87)}@`;
      }
      break;
    case 5: // Friday
      if (randomRoll < 1) {
        visitorName = visitors[Math.floor(Math.random() * getRandomArbitrary(20, 25))];
        visitor = `${visitorName}${calcPrevDate(32)}@`;
      } else {
        visitorName = visitors[Math.floor(getRandomArbitrary(50, 89))];
        visitor = `${visitorName}${calcPrevDate(116)}@`;
      }
      break;
    case 6: // Saturday
      if (randomRoll < 1) {
        visitorName = visitors[Math.floor(Math.random() * getRandomArbitrary(12, 18))];
        visitor = `${visitorName}${calcPrevDate(40)}@`;
      } else {
        visitorName = visitors[Math.floor(getRandomArbitrary(60, 89))];
        visitor = `${visitorName}${calcPrevDate(145)}@`;
      }
      break;
    case 0: // Sunday
    default:
      if (randomRoll < 1) {
        visitorName = visitors[Math.floor(Math.random() * getRandomArbitrary(8, 12))];
        visitor = `${visitorName}${calcPrevDate(48)}@`;
      } else {
        visitorName = visitors[Math.floor(getRandomArbitrary(65, 89))];
        visitor = `${visitorName}${calcPrevDate(174)}@`;
      }
      break;
  }

  const visitorIndex = Math.max(0, visitors.indexOf(visitorName));
  role = roles[visitorIndex % roles.length];
  account_id = accounts[visitorIndex % accounts.length] ?? accounts[0];
  const accString = account_id.replace(/\s/g, "");
  visitor = `${visitor}${accString}.com`;

  return {
    account: account_id,
    visitor: visitorName,
    visitorId: visitor,
    role
  };
}

function getVisitorId(accString: string): { visitor: string; role: UserRole } {
  const roll = Math.random() * 100;
  let visitor: string;
  let role: UserRole;

  if (roll < 25) {
    visitor = `visitor1@${accString}.com`;
    role = "admin";
  } else if (roll <= 50) {
    visitor = `visitor6@${accString}.com`;
    role = "admin";
  } else if (roll <= 65) {
    visitor = `visitor4@${accString}.com`;
    role = "user";
  } else if (roll <= 80) {
    visitor = `visitor7@${accString}.com`;
    role = "user";
  } else if (roll <= 90) {
    visitor = `visitor5@${accString}.com`;
    role = "user";
  } else if (roll <= 95) {
    visitor = `visitor3@${accString}.com`;
    role = "read-only";
  } else {
    visitor = `visitor2@${accString}.com`;
    role = "read-only";
  }

  return { visitor, role };
}

export function generateUserInfoByIndex(index: number): UserInfo {
  const visitorIndex = index % visitors.length;
  const visitorName = visitors[visitorIndex];
  const role = roles[visitorIndex % roles.length];
  const account_id = accounts[visitorIndex % accounts.length];
  const accString = account_id.replace(/\s/g, "");
  const visitorId = `${visitorName}@${accString}.com`;

  return {
    account: account_id,
    visitor: visitorName,
    visitorId,
    role,
  };
}

export function generateUserInfo(): UserInfo {
  const urlParams = new URLSearchParams(window.location.search);
  const urlVisitor = urlParams.get("visitor");
  const urlAccount = urlParams.get("account");
  // NOTE: role is intentionally NOT overridable via URL params.
  // Allowing ?role=admin would let any visitor spoof analytics segments
  // and could become a privilege escalation vector if role is ever used
  // for access control. Role is always derived server/data-side.

  const randomRoll = getRandomArbitrary(0, 3);
  let userInfo: UserInfo;

  if (randomRoll > 2) {
    const account_id = oldAccounts[Math.floor(Math.random() * oldAccounts.length)];
    const accString = account_id.replace(/\s/g, "");
    const { visitor, role } = getVisitorId(accString);
    userInfo = {
      account: account_id,
      visitor: visitor.slice(0, visitor.indexOf("@")),
      visitorId: visitor,
      role
    };
  } else {
    userInfo = getDateBasedVisitorId();
  }

  // Override with URL params if provided
  if (urlAccount) {
    userInfo.account = urlAccount;
  }
  if (urlVisitor) {
    userInfo.visitor = urlVisitor;
    userInfo.visitorId = `${urlVisitor}@${userInfo.account.replace(/\s/g, "")}.com`;
  }

  return userInfo;
}
