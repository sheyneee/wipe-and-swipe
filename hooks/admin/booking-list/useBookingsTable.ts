const [currentPage, setCurrentPage] = useState(1);
const [sortField, setSortField] = useState<SortField>(null);
const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
const [serviceFilter, setServiceFilter] = useState<string>("");
const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
const [searchQuery, setSearchQuery] = useState("");