import json
from typing import Optional


class TicketRepository:
    def __init__(self, filepath: str):
        with open(filepath) as json_file:
            self.data = json.load(json_file)

    def get_tickets(self, limit: Optional[int] = None) -> list:
        return self.data["tickets"][:limit]

    def update_ticket_by_id(self, id_to_update: str, updated_data: dict):
        for ticket in self.data["tickets"]:
            if ticket["id"] == id_to_update:
                ticket.update(updated_data)
                break

        # Write the updated data back to the JSON file
        with open(self.filepath, 'w') as file:
            json.dump(self.data, file, indent=4)
