from airflow.sdk import asset
from airflow.sdk import Variable

DIRECTORY_SERVICE_URL = Variable.get("directory_service_url")
PROJECT_ID = Variable.get("project_id")
EVERY_MINUTE = "*/1 * * * *"


@asset(schedule=EVERY_MINUTE)
def note_tags_dag_task() -> list[dict]:
    import requests
    tags_get_request_result = requests.get(
        url=f"{DIRECTORY_SERVICE_URL}/tags",
        headers={"projectid": PROJECT_ID}
    )
    tags = tags_get_request_result.json()

    return tags


@asset(schedule=[note_tags_dag_task])
def selected_tags(context) -> dict:
    # Access the triggering asset events from context
    triggering_events = context["triggering_asset_events"]

    # Get the event for the upstream asset (note_tags_dag_task is the asset)
    events_for_asset = triggering_events.get(note_tags_dag_task, [])

    if not events_for_asset:
        # Fallback if no events found
        return {"tags": []}

    # Get the most recent event
    latest_event = events_for_asset[-1]

    # Pull the XCom directly from the source task instance
    # This bypasses the broken cross-DAG xcom_pull logic
    tags = latest_event.source_task_instance.xcom_pull(key="return_value")

    return {
        "tags": tags or []
    }

    # tags = context["ti"].xcom_pull(
    #     dag_id="note_tags_dag_task",
    #     task_ids="note_tags_dag_task",
    #     key="return_value",
    #     include_prior_dates=True,
    # )
    # return {
    #     "tags": tags
    # }
