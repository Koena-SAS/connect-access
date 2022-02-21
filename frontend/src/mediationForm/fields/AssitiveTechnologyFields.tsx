import { t, Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import Checkbox from "@mui/material/Checkbox";
import produce from "immer";
import { useMemo } from "react";
import { assistiveTechnologyMap } from "../../constants/choicesMap";
import { BorderedFieldset, Radio, TextField, Warning } from "../../forms";
import type { AssistiveTechnology } from "../../types/mediationRequest";
import { Langs, YesNo } from "../../types/types";
import type { AssistiveTechnologiesUsed } from "../UserInfo";

const technologyTypes: readonly AssistiveTechnology[] = [
  "KEYBOARD",
  "SCREEN_READER_VOCAL_SYNTHESIS",
  "BRAILLE_DISPLAY",
  "ZOOM_SOFTWARE",
  "VOCAL_COMMAND_SOFTWARE",
  "DYS_DISORDER_SOFTWARE",
  "VIRTUAL_KEYBOARD",
  "ADAPTED_NAVIGATION_DISPOSITIVE",
  "EXCLUSIVE_KEYBOARD_NAVIGATION",
  "OTHER",
] as const;

type AssitiveTechnologyFieldsProps = {
  assistiveTechnologiesUsed: AssistiveTechnologiesUsed;
  setAssistiveTechnologiesUsed: (
    assistiveTechnologiesUsed: AssistiveTechnologiesUsed
  ) => void;
  /**
   * Wether this component is shown to a lambda user who needs more explanation.
   */
  isUserFacing: boolean;
  /**
   * The class name passed to the main container div.
   */
  className?: string;
  [borderFieldsetProps: string]: any;
};

/**
 * Fields for assistive technology of the main mediation form.
 */
function AssitiveTechnologyFields({
  assistiveTechnologiesUsed,
  setAssistiveTechnologiesUsed,
  className,
  isUserFacing,
  ...borderFieldsetProps
}: AssitiveTechnologyFieldsProps) {
  const { i18n } = useLingui();
  const lang = i18n.locale as Langs;
  const sortedTechnologyTypes = useMemo(() => {
    return getAllSortedTechnologyTypes(lang);
  }, [lang]);

  function getUsedTechnologyTypes(): AssistiveTechnology[] {
    return assistiveTechnologiesUsed.technologies.map(
      (technology) => technology.technologyType
    );
  }

  function getUsedTechnologyFromType(type: AssistiveTechnology) {
    const technology = assistiveTechnologiesUsed.technologies.filter(
      (technology) => technology.technologyType === type
    );
    if (technology.length === 0) {
      throw new Error(`The technology type ${type} was not selected.`);
    }
    return technology[0];
  }

  function handleIsUsedChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAssistiveTechnologiesUsed(
      produce(assistiveTechnologiesUsed, (draftState) => {
        draftState.isUsed = event.currentTarget.value as "" | YesNo;
      })
    );
  }

  function handleTechnologyTypeChange(
    event: React.ChangeEvent<HTMLInputElement>,
    type: AssistiveTechnology
  ) {
    if (event.target.checked) {
      setAssistiveTechnologiesUsed(
        produce(assistiveTechnologiesUsed, function addTechnology(draftState) {
          draftState.technologies.push({
            technologyType: type,
            technologyName: "",
            technologyVersion: "",
          });
        })
      );
    } else {
      setAssistiveTechnologiesUsed(
        produce(
          assistiveTechnologiesUsed,
          function removeTechnology(draftState) {
            draftState.technologies = draftState.technologies.filter(
              (technology) => {
                return technology.technologyType !== type;
              }
            );
          }
        )
      );
    }
  }

  function handleTechnologyNameChange(
    event: React.ChangeEvent<HTMLInputElement>,
    type: AssistiveTechnology
  ) {
    setAssistiveTechnologiesUsed(
      produce(
        assistiveTechnologiesUsed,
        function updateTechnologyName(draftState) {
          for (let i = 0; i < draftState.technologies.length; i++) {
            if (draftState.technologies[i].technologyType === type) {
              draftState.technologies[i].technologyName = event.target.value;
              break;
            }
          }
        }
      )
    );
  }

  function handleTechnologyVersionChange(
    event: React.ChangeEvent<HTMLInputElement>,
    type: AssistiveTechnology
  ) {
    setAssistiveTechnologiesUsed(
      produce(
        assistiveTechnologiesUsed,
        function updateTechnologyVersion(draftState) {
          for (let i = 0; i < draftState.technologies.length; i++) {
            if (draftState.technologies[i].technologyType === type) {
              draftState.technologies[i].technologyVersion = event.target.value;
              break;
            }
          }
        }
      )
    );
  }

  const areAssistiveTechnologiesUsed =
    assistiveTechnologiesUsed.isUsed === "YES";
  const areAssistiveTechnologiesSelected =
    assistiveTechnologiesUsed.technologies.length > 0;
  return (
    <BorderedFieldset
      legend={t`Information about assistive technology used`}
      fieldsetClassName={`${className ? className : ""} assistive-technology`}
      level={3}
      legendClassName="assistive-technology__title"
      {...borderFieldsetProps}
    >
      {isUserFacing && (
        <Warning
          containerClassName="assistive-technology__warning"
          text={t`If you don't use any assistance technology, you can ignore the
            following questions and go to next step. However, if you use
            technologies to compensate for your disability in numeric
            usage, any details would help us to process your demand.`}
        />
      )}
      <div
        role="radiogroup"
        aria-labelledby="technologyIsUsed"
        className="radio-container assistive-technology__isUsed"
      >
        <p
          id="technologyIsUsed"
          className="label radio-container assistive-technology__isUsedTitle"
        >
          <Trans>Do you use assistive technologies?</Trans>
        </p>
        <div className="assistive-technology__isUsedItems">
          <Radio
            name="technologyIsUsed"
            id="technologyIsUsedYes"
            value="YES"
            label={t`Yes`}
            containerClassName="assistive-technology__isUsedItem"
            onChange={handleIsUsedChange}
            checked={assistiveTechnologiesUsed.isUsed === "YES"}
          />
          <Radio
            name="technologyIsUsed"
            id="technologyIsUsedNo"
            value="NO"
            label={t`No`}
            containerClassName="assistive-technology__isUsedItem"
            onChange={handleIsUsedChange}
            checked={assistiveTechnologiesUsed.isUsed === "NO"}
          />
          <Radio
            name="technologyIsUsed"
            id="technologyIsUsedNotSpecified"
            value=""
            label={t`Would rather not to mention`}
            containerClassName="assistive-technology__isUsedItem"
            onChange={handleIsUsedChange}
            checked={assistiveTechnologiesUsed.isUsed === ""}
          />
        </div>
      </div>
      {areAssistiveTechnologiesUsed && (
        <div
          role="group"
          aria-labelledby="technologyTypes"
          className="checkbox-container assistive-technology__type"
        >
          <p
            id="technologyTypes"
            className="label checkbox-container assistive-technology__typeTitle"
          >
            <Trans>Assistive technologies used</Trans>
          </p>
          <div className="assistive-technology__typeItems">
            {sortedTechnologyTypes.map((technology) => {
              return (
                <div
                  className="assistive-technology__typeItem"
                  key={technology}
                >
                  <Checkbox
                    inputProps={{ id: `technologyTypes${technology}` }}
                    color="success"
                    checked={getUsedTechnologyTypes().includes(technology)}
                    onChange={(event) =>
                      handleTechnologyTypeChange(event, technology)
                    }
                  />
                  <label
                    htmlFor={`technologyTypes${technology}`}
                    className="label"
                  >
                    {assistiveTechnologyMap[technology][lang]}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {areAssistiveTechnologiesUsed && areAssistiveTechnologiesSelected && (
        <div
          role="group"
          aria-labelledby="technologyNameAndVersion"
          className="checkbox-container assistive-technology__nameAndVersion"
        >
          <p
            id="technologyNameAndVersion"
            className="label checkbox-container assistive-technology__nameAndVersionTitle"
          >
            <Trans>Assistive technology name(s) and version(s)</Trans>
          </p>
          <div className="assistive-technology__nameAndVersionItems">
            {assistiveTechnologiesUsed.technologies.map((technologyUsed) => {
              return (
                <div
                  role="group"
                  className="assistive-technology__nameAndVersionItem"
                  aria-labelledby={`technologyNameAndVersion${technologyUsed.technologyType}`}
                  key={technologyUsed.technologyType}
                >
                  <p
                    className="label assistive-technology__nameAndVersionItemLegend"
                    id={`technologyNameAndVersion${technologyUsed.technologyType}`}
                  >
                    {
                      assistiveTechnologyMap[technologyUsed.technologyType][
                        lang
                      ]
                    }
                  </p>
                  <div className="label assistive-technology__nameAndVersionField">
                    <TextField
                      id="technologyName"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleTechnologyNameChange(
                          event,
                          technologyUsed.technologyType
                        )
                      }
                      label={t`Name`}
                      type="text"
                      value={
                        getUsedTechnologyFromType(technologyUsed.technologyType)
                          .technologyName
                      }
                    />
                  </div>
                  <div className="label assistive-technology__nameAndVersionField assistive-technology__nameAndVersionFieldVersion">
                    <TextField
                      id="technologyVersion"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleTechnologyVersionChange(
                          event,
                          technologyUsed.technologyType
                        )
                      }
                      label={t`Version`}
                      type="text"
                      value={
                        getUsedTechnologyFromType(technologyUsed.technologyType)
                          .technologyVersion
                      }
                      className="label assistive-technology__nameAndVersionField"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </BorderedFieldset>
  );
}

function getAllSortedTechnologyTypes(lang: Langs): AssistiveTechnology[] {
  function alphabeticalTranslationCompare(
    a: AssistiveTechnology,
    b: AssistiveTechnology
  ): number {
    const translatedA = assistiveTechnologyMap[a][lang];
    const translatedB = assistiveTechnologyMap[b][lang];
    if (translatedA < translatedB) {
      return -1;
    } else if (translatedA > translatedB) {
      return 1;
    } else {
      return 0;
    }
  }
  return technologyTypes.slice().sort(alphabeticalTranslationCompare);
}

export default AssitiveTechnologyFields;
