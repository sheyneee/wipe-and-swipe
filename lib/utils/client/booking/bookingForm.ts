import { SERVICES } from "@/lib/data/services";

export type BookingFormState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  serviceType: string;
  otherServiceType: string;
  serviceAddress: string;
  preferredDate: string;
  preferredTime: string;
  specialRequests: string;
};

export function getInitialBookingFormState(): BookingFormState {
  return {
    fullName: "",
    email: "",
    phoneNumber: "",
    serviceType: "",
    otherServiceType: "",
    serviceAddress: "",
    preferredDate: "",
    preferredTime: "",
    specialRequests: "",
  };
}

export function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDateLimits() {
  const today = new Date();

  const minDate = new Date(today);
  minDate.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  maxDate.setHours(0, 0, 0, 0);

  return {
    min: formatLocalDate(minDate),
    max: formatLocalDate(maxDate),
  };
}

export function isDateWithinNextYear(dateString: string) {
  if (!dateString) return false;

  const selected = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(selected.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneYearFromToday = new Date(today);
  oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1);

  return selected >= today && selected <= oneYearFromToday;
}

export function resolveInitialService(initialService: string) {
  if (!initialService.trim()) {
    return {
      serviceType: "",
      otherServiceType: "",
    };
  }

  const matchedService = SERVICES.find((service) => service.value === initialService);

  if (matchedService) {
    return {
      serviceType: matchedService.value,
      otherServiceType: "",
    };
  }

  return {
    serviceType: "others",
    otherServiceType: initialService,
  };
}

export function getFinalServiceType(form: BookingFormState) {
  if (form.serviceType === "others") {
    return form.otherServiceType.trim();
  }

  return (
    SERVICES.find((service) => service.value === form.serviceType)?.title ||
    form.serviceType
  );
}

export function normalizeNzPhoneNumber(phoneNumber: string) {
  const trimmed = phoneNumber.trim();

  if (!trimmed) return "";

  const compact = trimmed.replace(/[\s()-]/g, "");

  if (compact.startsWith("+64")) {
    return `+64${compact.slice(3).replace(/\D/g, "")}`;
  }

  const digitsOnly = compact.replace(/\D/g, "");

  if (!digitsOnly) return "";

  const withoutLeadingZero = digitsOnly.startsWith("0")
    ? digitsOnly.slice(1)
    : digitsOnly;

  return `+64${withoutLeadingZero}`;
}

export function isValidNzPhoneNumber(phoneNumber: string) {
  const normalized = normalizeNzPhoneNumber(phoneNumber);
  return /^\+64\d{8,10}$/.test(normalized);
}