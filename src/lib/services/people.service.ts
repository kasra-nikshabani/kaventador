import { FOUNDER_ID } from "@/data/people.mock";
import { findAllPeople, findPersonById } from "@/lib/repositories";
import type { Person } from "@/types";

/** بنیان‌گذار پلتفرم — در صفحه درباره ما استفاده می‌شود. */
export async function getFounder(): Promise<Person | null> {
  return findPersonById(FOUNDER_ID);
}

/** همه مدرسان و نویسندگان. */
export async function getPeople(): Promise<Person[]> {
  return findAllPeople();
}
