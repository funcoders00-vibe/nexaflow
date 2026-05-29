// ==============================
// 🧠 CORE MODULE (CLIENT + PROJECT)
// ==============================

Table clients {
  client_id integer [primary key]
  client_name varchar
  contact_person varchar
  email varchar [unique]
  phone varchar
  created_at timestamp
}

Table users {
  user_id integer [primary key]
  name varchar
  email varchar [unique]
  role varchar
  created_at timestamp
}

Table projects {
  project_id integer [primary key]
  client_id integer [not null]
  user_id integer
  project_name varchar
  description text
  budget float
  deadline date
  current_status varchar  // Started, In Progress, Completed
  created_at timestamp
}


// ==============================
// 📊 PROJECT TRACKING
// ==============================

Table project_status_logs {
  log_id integer [primary key]
  project_id integer [not null]
  status varchar
  updated_at timestamp
}


// ==============================
// 🔔 NOTIFICATIONS
// ==============================

Table notifications {
  notification_id integer [primary key]
  project_id integer
  user_id integer
  message text
  type varchar  // email / dashboard
  is_read boolean
  created_at timestamp
}


// ==============================
// 📄 AGREEMENT MODULE
// ==============================

Table agreements {
  agreement_id integer [primary key]
  project_id integer [not null, unique]
  document_id integer
  is_signed boolean
  created_at timestamp
}


// ==============================
// 💰 INVOICE MODULE
// ==============================

Table invoices {
  invoice_id integer [primary key]
  project_id integer [not null, unique]
  invoice_number varchar [unique]
  base_amount float
  gst_percentage float  // usually 18%
  gst_amount float
  total_amount float
  document_id integer
  created_at timestamp
}


// ==============================
// 📧 COMMUNICATION MODULE
// ==============================

Table email_templates {
  template_id integer [primary key]
  template_name varchar   // welcome, agreement, invoice, reminder
  subject varchar
  body text
  created_at timestamp
}

Table emails {
  email_id integer [primary key]
  client_id integer
  project_id integer
  template_id integer
  email_type varchar
  subject varchar
  body text
  status varchar       // sent, failed
  sent_at timestamp
}


// ==============================
// 📁 DOCUMENT MANAGEMENT (CORE STORAGE)
// ==============================

Table documents {
  document_id integer [primary key]
  client_id integer
  project_id integer
  file_name varchar
  file_type varchar   // agreement, invoice, client_file
  file_url varchar
  uploaded_at timestamp
}


// ==============================
// 🔗 RELATIONSHIPS
// ==============================

Ref: projects.client_id > clients.client_id
Ref: projects.user_id > users.user_id

Ref: project_status_logs.project_id > projects.project_id

Ref: notifications.project_id > projects.project_id
Ref: notifications.user_id > users.user_id

Ref: agreements.project_id > projects.project_id
Ref: agreements.document_id > documents.document_id

Ref: invoices.project_id > projects.project_id
Ref: invoices.document_id > documents.document_id

Ref: emails.client_id > clients.client_id
Ref: emails.project_id > projects.project_id
Ref: emails.template_id > email_templates.template_id

Ref: documents.client_id > clients.client_id
Ref: documents.project_id > projects.project_id