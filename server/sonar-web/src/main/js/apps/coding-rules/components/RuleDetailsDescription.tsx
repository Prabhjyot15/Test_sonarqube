/*
 * SonarQube
 * Copyright (C) 2009-2024 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import {
  ButtonPrimary,
  ButtonSecondary,
  CodeSyntaxHighlighter,
  DangerButtonSecondary,
  InputTextArea,
  Spinner,
} from 'design-system';
import * as React from 'react';
import FormattingTips from '../../../components/common/FormattingTips';
import RuleTabViewer from '../../../components/rules/RuleTabViewer';
import { translate, translateWithParameters } from '../../../helpers/l10n';
import { sanitizeString, sanitizeUserInput } from '../../../helpers/sanitize';
import { useUpdateRuleMutation } from '../../../queries/rules';
import { RuleDetails } from '../../../types/types';
import { RuleDescriptionSections } from '../rule';
import RemoveExtendedDescriptionModal from './RemoveExtendedDescriptionModal';

interface Props {
  canWrite: boolean | undefined;
  ruleDetails: RuleDetails;
}

export default function RuleDetailsDescription(props: Readonly<Props>) {
  const { ruleDetails, canWrite } = props;
  const [description, setDescription] = React.useState('');
  const [descriptionForm, setDescriptionForm] = React.useState(false);
  const [removeDescriptionModal, setDescriptionModal] = React.useState(false);

  const { mutate: updateRule, isLoading: updatingRule } = useUpdateRuleMutation(undefined, () =>
    setDescriptionForm(false),
  );

  const updateDescription = (text = '') => {
    updateRule({
      key: ruleDetails.key,
      markdown_note: text,
    });
  };

  const renderExtendedDescription = () => (
    <div id="coding-rules-detail-description-extra">
      {ruleDetails.htmlNote !== undefined && (
        <CodeSyntaxHighlighter
          className="markdown sw-my-6"
          htmlAsString={sanitizeUserInput(ruleDetails.htmlNote)}
          language={ruleDetails.lang}
        />
      )}

      <div className="sw-my-6">
        {canWrite && (
          <ButtonSecondary
            onClick={() => {
              setDescription(ruleDetails.mdNote ?? '');
              setDescriptionForm(true);
            }}
          >
            {translate('coding_rules.extend_description')}
          </ButtonSecondary>
        )}
      </div>
    </div>
  );

  const renderForm = () => (
    <form
      aria-label={translate('coding_rules.detail.extend_description.form')}
      className="sw-my-6"
      onSubmit={(event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateDescription(description);
      }}
    >
      <InputTextArea
        aria-label={translate('coding_rules.extend_description')}
        className="sw-mb-2 sw-resize-y"
        id="coding-rules-detail-extend-description-text"
        size="full"
        onChange={({ currentTarget: { value } }: React.SyntheticEvent<HTMLTextAreaElement>) =>
          setDescription(value)
        }
        rows={4}
        value={description}
      />

      <div className="sw-flex sw-items-center sw-justify-between">
        <div className="sw-flex sw-items-center">
          <ButtonPrimary
            id="coding-rules-detail-extend-description-submit"
            disabled={updatingRule}
            type="submit"
          >
            {translate('save')}
          </ButtonPrimary>

          {ruleDetails.mdNote !== undefined && (
            <>
              <DangerButtonSecondary
                className="sw-ml-2"
                disabled={updatingRule}
                id="coding-rules-detail-extend-description-remove"
                onClick={() => setDescriptionModal(true)}
              >
                {translate('remove')}
              </DangerButtonSecondary>
              {removeDescriptionModal && (
                <RemoveExtendedDescriptionModal
                  onCancel={() => setDescriptionModal(false)}
                  onSubmit={() => {
                    setDescriptionModal(false);
                    updateDescription();
                  }}
                />
              )}
            </>
          )}

          <ButtonSecondary
            className="sw-ml-2"
            disabled={updatingRule}
            id="coding-rules-detail-extend-description-cancel"
            onClick={() => setDescriptionForm(false)}
          >
            {translate('cancel')}
          </ButtonSecondary>

          <Spinner className="sw-ml-2" loading={updatingRule} />
        </div>

        <FormattingTips />
      </div>
    </form>
  );

  const hasDescription = !ruleDetails.isExternal || ruleDetails.type !== 'UNKNOWN';

  const hasDescriptionSection =
    hasDescription && ruleDetails.descriptionSections && ruleDetails.descriptionSections.length > 0;

  const defaultSection =
    hasDescriptionSection &&
    ruleDetails.descriptionSections?.length === 1 &&
    ruleDetails.descriptionSections[0].key === RuleDescriptionSections.DEFAULT
      ? ruleDetails.descriptionSections[0]
      : undefined;

  const introductionSection = ruleDetails.descriptionSections?.find(
    (section) => section.key === RuleDescriptionSections.INTRODUCTION,
  )?.content;

  return (
    <div className="js-rule-description">
      {hasDescriptionSection && !defaultSection && (
        <>
          {introductionSection && (
            <CodeSyntaxHighlighter
              className="rule-desc"
              htmlAsString={sanitizeString(introductionSection)}
              language={ruleDetails.lang}
            />
          )}
        </>
      )}

      <RuleTabViewer ruleDetails={ruleDetails} />

      {ruleDetails.isExternal && (
        <div className="coding-rules-detail-description rule-desc markdown">
          {translateWithParameters('issue.external_issue_description', ruleDetails.name)}
        </div>
      )}

      {!ruleDetails.templateKey && (
        <div className="sw-mt-6">
          {!descriptionForm && renderExtendedDescription()}
          {descriptionForm && canWrite && renderForm()}
        </div>
      )}
    </div>
  );
}
