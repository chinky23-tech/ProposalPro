import db from "../config/db.js";

// Fetch full user settings profile
export const getUserSettingsRepo = async (userId) => {
  const query = `
    SELECT 
      u.id, u.name, u.email, u.billing_tier,
      ws.company_name, ws.brand_color, ws.default_currency, ws.company_logo,
      np.email_proposal_opened, np.email_proposal_accepted, np.email_payment_received
    FROM users u
    LEFT JOIN workspace_settings ws ON ws.user_id = u.id
    LEFT JOIN notification_preferences np ON np.user_id = u.id
    WHERE u.id = $1;
  `;
  const { rows } = await db.query(query, [userId]);
  return rows[0];
};

// Update User Profile (Name/Email)
export const updateUserProfileRepo = async (userId, data) => {
  const query = `
    UPDATE users
    SET 
      name = COALESCE($2, name),
      updated_at = NOW()
    WHERE id = $1
    RETURNING id, name, email, billing_tier;
  `;
  const { rows } = await db.query(query, [userId, data.name]);
  return rows[0];
};

// Fetch Password Hash for verification
export const getUserPasswordHashRepo = async (userId) => {
  const query = `SELECT password_hash FROM users WHERE id = $1;`;
  const { rows } = await db.query(query, [userId]);
  return rows[0]?.password_hash;
};

// Update User Password
export const updateUserPasswordRepo = async (userId, hashedPassword) => {
  const query = `
    UPDATE users
    SET 
      password_hash = $2,
      updated_at = NOW()
    WHERE id = $1;
  `;
  await db.query(query, [userId, hashedPassword]);
  return true;
};
// Upsert Workspace Settings
export const upsertWorkspaceSettingsRepo = async (userId, data) => {
  const query = `
    INSERT INTO workspace_settings (user_id, company_name, brand_color, default_currency, updated_at)
    VALUES ($1, $2, $3, $4, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      company_name = EXCLUDED.company_name,
      brand_color = EXCLUDED.brand_color,
      default_currency = EXCLUDED.default_currency,
      updated_at = NOW()
    RETURNING *;
  `;
  const values = [userId, data.companyName, data.brandColor, data.defaultCurrency];
  const { rows } = await db.query(query, values);
  return rows[0];
};

// Upsert Notification Preferences
export const upsertNotificationPreferencesRepo = async (userId, data) => {
  const query = `
    INSERT INTO notification_preferences (user_id, email_proposal_opened, email_proposal_accepted, email_payment_received, updated_at)
    VALUES ($1, $2, $3, $4, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      email_proposal_opened = EXCLUDED.email_proposal_opened,
      email_proposal_accepted = EXCLUDED.email_proposal_accepted,
      email_payment_received = EXCLUDED.email_payment_received,
      updated_at = NOW()
    RETURNING *;
  `;
  const values = [userId, data.emailProposalOpened, data.emailProposalAccepted, data.emailPaymentReceived];
  const { rows } = await db.query(query, values);
  return rows[0];
};