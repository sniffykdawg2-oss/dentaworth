export function SpamTrap({ formStartedAt }: { formStartedAt: number }) {
  return (
    <div className="bot-field" aria-hidden="true">
      <label>
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <input type="hidden" name="formStartedAt" value={formStartedAt} />
    </div>
  );
}
