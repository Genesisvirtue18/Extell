#!/bin/bash

# Function to create admin page
create_admin_page() {
  local route=$1
  local component=$2
  
  mkdir -p "src/app/admin/$route"
  
  cat > "src/app/admin/$route/page.tsx" << EOF
import ${component} from '@/admin/pages/${component}';

export default function Page() {
  return <${component} />;
}
EOF
  echo "Created admin page: $route"
}

# Create all admin pages
create_admin_page "login" "LoginPage"
create_admin_page "dashboard" "DashboardPage"
create_admin_page "products" "ProductsPage"
create_admin_page "users" "UsersPage"
create_admin_page "solutions" "SolutionsPage"
create_admin_page "projects" "ProjectsPage"
create_admin_page "resources" "ResourcesPage"
create_admin_page "quotes" "QuotesPage"
create_admin_page "tickets" "TicketsPage"
create_admin_page "warranties" "WarrantyPage"
create_admin_page "homepage" "HomepagePage"
create_admin_page "settings" "SettingsPage"
create_admin_page "ups-dashboard" "UpsDashboard"

echo "All admin pages created!"
